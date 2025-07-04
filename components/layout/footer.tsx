"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer role="contentinfo" className="bg-gray-900 text-white dark:bg-gray-800">
      <div className="w-full  mx-auto px-8 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/images/logo.png"
                alt="Logo de Bridge Technologies Solutions"
                width={40}
                height={40}
              />
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Bridge Technologies Solutions - Votre partenaire pour la gestion des stages et le développement des
              compétences. Nous connectons les talents aux opportunités.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/entreprise" className="text-gray-300 hover:text-white transition-colors">
                  L'entreprise
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-gray-300 hover:text-white transition-colors">
                  Contacts
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                <address className="not-italic text-gray-300 text-sm">
                  123 Rue de la Technologie<br />
                  75001 Paris, France
                </address>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">contact@bridge-tech.fr</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Bridge Technologies Solutions. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Conditions d'utilisation
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
