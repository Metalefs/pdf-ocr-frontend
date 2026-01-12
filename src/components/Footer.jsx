import React from 'react';
import { useI18n } from "../i18n";
import { Link } from 'react-router-dom';

/**
 * Footer simples para o aplicativo PDF OCR Frontend.
 * Mantém-se intencionalmente minimalista para facilitar adaptação ao estilo do projeto.
 */
const Footer = () => {
  const year = new Date().getFullYear();
  const { t } = useI18n();

  return (
      <footer className="bg-slate-50 text-slate-700 py-10">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row md:justify-between gap-6 md:items-start mb-6">
                  <div>
                      <h4 className="font-semibold text-lg mb-2">{t("header.brand")}</h4>
                      <p className="text-sm text-slate-500">{t("hero.subtitle")}</p>
                  </div>

                  <div className="text-sm text-slate-500">
                      <div className="font-medium mb-2">{t("footer.technology")}</div>
                      <ul className="space-y-1">
                          <li>Tesseract OCR</li>
                          <li>iText PDF</li>
                          <li>Scalable Processing</li>
                      </ul>
                  </div>

                  <div className="text-sm text-slate-500">
                      <div className="font-medium mb-2">{t("footer.privacy")}</div>
                      <p>{t("footer.privacy") === "Privacidade" ? "Arquivos processados de forma segura e removidos conforme política de retenção." : "Files are processed securely and removed according to retention policy."}</p>
                      <div className="mt-2">
                          <Link to="/privacy" className="text-slate-600 hover:underline mr-3">{t("footer.privacy")}</Link>
                          <Link to="/contact" className="text-slate-600 hover:underline">Contact</Link>
                      </div>
                  </div>
              </div>

              <div className="border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
                  <p>&copy; {year} {t("header.brand")}. {t("footer.copy")}</p>
              </div>
          </div>
      </footer>
  );
};


export default Footer;