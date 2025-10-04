import React from 'react';
import { Link } from 'react-router-dom';
import { useCMS } from './cms/cms-context';
import { Calculator, Github, Twitter, Linkedin, Mail, Facebook, Instagram } from 'lucide-react';

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, any> = {
  Twitter,
  Github,
  Linkedin,
  Mail,
  Facebook,
  Instagram,
  Calculator
};

export function Footer() {
  const { data } = useCMS();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold">{data.footer.companyInfo.name}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {data.footer.companyInfo.description}
            </p>
            <div className="flex space-x-4">
              {data.footer.social.map((social, index) => {
                const IconComponent = iconMap[social.icon] || Mail;
                return (
                  <a 
                    key={index}
                    href={social.url} 
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                    aria-label={social.platform}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Dynamic Link Sections */}
          {data.footer.links.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-semibold text-lg">{section.title}</h3>
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <Link 
                    key={itemIndex}
                    to={item.href} 
                    className="block text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-start space-x-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a 
                  href={`mailto:${data.footer.contact.email}`}
                  className="hover:text-white transition-colors"
                >
                  {data.footer.contact.email}
                </a>
              </div>
              {data.footer.contact.phone && (
                <div className="flex items-start space-x-2">
                  <span className="w-4 h-4 text-center text-xs mt-0.5">📞</span>
                  <span>{data.footer.contact.phone}</span>
                </div>
              )}
              {data.footer.contact.address && (
                <div className="flex items-start space-x-2">
                  <span className="w-4 h-4 text-center text-xs mt-0.5">📍</span>
                  <span className="whitespace-pre-line">{data.footer.contact.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              {data.footer.companyInfo.copyright}
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}