import React from "react";
import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">

                <h3 className="footer-logo">
                    Честный<span>Товар</span>
                </h3>

                <p className="footer-description">
                    Сервис для сравнения цен на товары со всех популярных маркетплейсов.
                    Экономьте время и деньги!
                </p>

                <div className="footer-divider"></div>

                <p className="footer-copy">
                    © 2026 ЧестныйТовар. Все права защищены.
                </p>

            </div>
        </footer>
    );
}

export default Footer;