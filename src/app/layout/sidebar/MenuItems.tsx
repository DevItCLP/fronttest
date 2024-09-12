import { usePathname } from "next/navigation";
import { headerSSA, subTitlesSsa, itemsssa } from "@/app/layout/sidebar/NavModules/ssa/ResourcesSlidebarSsa";
import { headerQA, itemsqa, subTitlesQA } from "@/app/layout/sidebar/NavModules/qa/ResourceSlidebarQA";
import { headerSettings, itemssettings, subTitlesSettings } from "@/app/layout/sidebar/NavModules/settings/ResourcesSlideBarSettings";

function GetMenuitems(): [headerMain[], subTitles[], itemsTitles[]] {
  const pathname = usePathname();
  if (pathname.startsWith("/pages/ssa")) {
    return [headerSSA, subTitlesSsa, itemsssa];
  } else if (pathname.startsWith("/pages/qa")) {
    return [headerQA, subTitlesQA, itemsqa];
  } else if (pathname.startsWith("/pages/settings")) {
    return [headerSettings, subTitlesSettings, itemssettings];
  } else {
    return [[], [], []];
  }
}

export default GetMenuitems;
