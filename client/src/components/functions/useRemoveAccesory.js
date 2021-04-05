import React, { useEffect } from "react"
export const useRemoveAccesory = () => {
    useEffect(() => {
        const rootDom = document.getElementById("root");
        const nav = rootDom.getElementsByClassName("menu");
        const footer = rootDom.getElementsByClassName("footer-container");
        nav[0].remove();
        footer[0].remove();
    }, [])
}