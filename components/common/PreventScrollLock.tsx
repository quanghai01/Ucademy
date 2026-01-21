"use client";

import { useEffect } from "react";

export function PreventScrollLock() {
    useEffect(() => {
        const removeScrollLock = () => {
            const body = document.body;

            // Remove the attribute
            if (body.hasAttribute("data-scroll-locked")) {
                body.removeAttribute("data-scroll-locked");
            }

            // Force remove inline styles
            body.style.paddingRight = "";
            body.style.marginRight = "";
            body.style.paddingLeft = "";
            body.style.marginLeft = "";
            body.style.overflow = "";
        };

        const observer = new MutationObserver(() => {
            removeScrollLock();
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["data-scroll-locked", "style"],
        });

        // Also run on mount and interval as backup
        removeScrollLock();
        const interval = setInterval(removeScrollLock, 50);

        return () => {
            observer.disconnect();
            clearInterval(interval);
        };
    }, []);

    return null;
}
