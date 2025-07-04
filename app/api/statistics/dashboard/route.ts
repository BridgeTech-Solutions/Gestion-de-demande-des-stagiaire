import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Vérifier l'authentification
    const {
      data: { session },
    } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // Récupérer les statistiques utilisateurs
    const { data: usersStats } = await supabase
      .from("users")
      .select("role")
      .eq("is_active", true)

    // Récupérer les statistiques des documents
    const { data: documentsStats } = await supabase
      .from("documents")
      .select("id")

    // Récupérer les statistiques des demandes
    const { data: demandesStats } = await supabase
      .from("demandes")
      .select("statut")

    // Récupérer les statistiques des stagiaires
    const { data: stagiairesStats } = await supabase
      .from("stagiaires")
      .select("statut")

    // Calculer les statistiques
    const stats = {
      stagiaires_total: stagiairesStats?.length || 0,
      demandes_total: demandesStats?.length || 0,
      documents_total: documentsStats?.length || 0,
      evaluations_total: 0,
      stagiaires: {
        total: stagiairesStats?.length || 0,
        actif: stagiairesStats?.filter(s => s.statut === "actif").length || 0,
        termine: stagiairesStats?.filter(s => s.statut === "termine").length || 0,
        suspendu: stagiairesStats?.filter(s => s.statut === "suspendu").length || 0
      },
      demandes: {
        total: demandesStats?.length || 0,
        en_attente: demandesStats?.filter(d => d.statut === "en_attente").length || 0,
        approuvee: demandesStats?.filter(d => d.statut === "approuvee").length || 0,
        rejetee: demandesStats?.filter(d => d.statut === "rejetee").length || 0
      }
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error("Erreur récupération statistiques:", error)
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
