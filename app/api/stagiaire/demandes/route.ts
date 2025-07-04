import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Vérifier l'authentification
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession()

    const user = session?.user

    if (authError || !user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    console.log("🔍 Récupération des demandes pour l'utilisateur:", user.id)

    // Récupérer le profil stagiaire
    const { data: stagiaire, error: stagiaireError } = await supabase
      .from("stagiaires")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (stagiaireError || !stagiaire) {
      console.error("❌ Erreur récupération stagiaire:", stagiaireError)
      // Si pas de stagiaire trouvé, retourner une liste vide plutôt qu'une erreur
      return NextResponse.json({
        success: true,
        data: [],
        message: "Aucune demande trouvée"
      })
    }

    console.log("✅ Stagiaire trouvé:", stagiaire.id)

    // Récupérer les demandes avec gestion d'erreur
    const { data: demandes, error: demandesError } = await supabase
      .from("demandes")
      .select(`
        id,
        type,
        titre,
        description,
        statut,
        date_demande,
        date_reponse,
        commentaire_reponse,
        documents_requis,
        created_at,
        updated_at,
        tuteur_id
      `)
      .eq("stagiaire_id", stagiaire.id)
      .order("created_at", { ascending: false })

    if (demandesError) {
      console.error("❌ Erreur récupération demandes:", demandesError)
      // Retourner une liste vide si erreur de récupération
      return NextResponse.json({
        success: true,
        data: [],
        message: "Erreur lors de la récupération des demandes"
      })
    }

    console.log("✅ Demandes récupérées:", demandes?.length || 0)

    return NextResponse.json({
      success: true,
      data: demandes || [],
    })
  } catch (error) {
    console.error("💥 Erreur API demandes stagiaire:", error)
    return NextResponse.json({ 
      success: true, 
      data: [], 
      message: "Erreur serveur interne" 
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Vérifier l'authentification
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Récupérer le profil stagiaire
    const { data: stagiaire, error: stagiaireError } = await supabase
      .from("stagiaires")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (stagiaireError || !stagiaire) {
      console.error("❌ Erreur récupération stagiaire:", stagiaireError)
      return NextResponse.json({ error: "Profil stagiaire non trouvé" }, { status: 404 })
    }

    const body = await request.json()
    const { type, titre, description, documents, periode, congeData, prolongationData } = body

    console.log("📤 Création de demande:", { type, titre, stagiaireId: stagiaire.id })

    // Préparer les données de la demande
    const demandeData = {
      stagiaire_id: stagiaire.id,
      type,
      titre,
      description: description || "",
      statut: "en_attente",
      documents_requis: {
        documents: documents || {},
        periode: periode || {},
        congeData: congeData || {},
        prolongationData: prolongationData || {},
        date_creation: new Date().toISOString()
      },
      tuteur_id: body.tuteur_id, // <-- doit être présent ici
    }

    // Créer la demande
    const { data: nouvelleDemande, error: demandeError } = await supabase
      .from("demandes")
      .insert(demandeData)
      .select()
      .single()

    if (demandeError) {
      console.error("❌ Erreur création demande:", demandeError)
      throw demandeError
    }

    console.log("✅ Demande créée:", nouvelleDemande.id)

    // Si des documents ont été uploadés, les associer à la demande
    if (documents && Object.keys(documents).length > 0) {
      const documentPromises = Object.entries(documents).map(async ([type, file]) => {
        if (file) {
          try {
            const { error: docError } = await supabase
              .from("documents")
              .insert({
                demande_id: nouvelleDemande.id,
                user_id: user.id,
                nom: (file as any)?.name || `${type}_document`,
                type_document: type,
                statut: "en_attente",
                is_public: false
              })

            if (docError) {
              console.warn("⚠️ Erreur association document:", docError)
            }
          } catch (error) {
            console.warn("⚠️ Erreur traitement document:", error)
          }
        }
      })

      await Promise.allSettled(documentPromises)
    }

    return NextResponse.json({
      success: true,
      data: nouvelleDemande,
      message: "Demande créée avec succès",
    })
  } catch (error) {
    console.error("💥 Erreur création demande:", error)
    return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 })
  }
}
