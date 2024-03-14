export function themeToggle(): void {
  const toggleEl = document.querySelector<HTMLElement>("[data-toggle-theme]");
  const dataKey = toggleEl ? toggleEl.getAttribute("data-key") : null;

  (function (
    theme: string | null = localStorage.getItem(dataKey || "theme"),
  ): void {
    if (localStorage.getItem(dataKey || "theme") && theme) {
      document.documentElement.setAttribute("data-theme", theme);
      if (toggleEl) {
        Array.from(
          document.querySelectorAll<HTMLElement>("[data-toggle-theme]"),
        ).forEach((el) => {
          el.classList.add(toggleEl.getAttribute("data-act-class")!);
        });
      }
    }
  })();

  if (toggleEl) {
    Array.from(
      document.querySelectorAll<HTMLElement>("[data-toggle-theme]"),
    ).forEach((el) => {
      el.addEventListener("click", function () {
        const themesList = el.getAttribute("data-toggle-theme");
        if (themesList) {
          const themesArray = themesList.split(",");
          if (
            document.documentElement.getAttribute("data-theme") ===
            themesArray[0]
          ) {
            if (themesArray.length === 1) {
              document.documentElement.removeAttribute("data-theme");
              localStorage.removeItem(dataKey || "theme");
            } else {
              document.documentElement.setAttribute(
                "data-theme",
                themesArray[1],
              );
              localStorage.setItem(dataKey || "theme", themesArray[1]);
            }
          } else {
            document.documentElement.setAttribute("data-theme", themesArray[0]);
            localStorage.setItem(dataKey || "theme", themesArray[0]);
          }
        }
        Array.from(
          document.querySelectorAll<HTMLElement>("[data-toggle-theme]"),
        ).forEach((el) => {
          el.classList.toggle(this.getAttribute("data-act-class")!);
        });
      });
    });
  }
}
