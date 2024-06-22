import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import pages from "@/assets/pages.json";
import SideBarItem from "./sidebar_item";
import SideBarAccordionItem from "./sidebar_item_accordion";

interface PageData {
    name: string;
    url: string;
    icon: string;
    subPages?: PageData[];
};


function get_page_element(page: PageData) {
    if (typeof (page.subPages) === 'undefined') {
        return (
            <SideBarItem name={page.name} url={page.url} icon={page.icon} />
        );
    } else {
        let sp = page.subPages as PageData[];
        let subPages = sp.map((subPage) => get_page_element(subPage));
        return (<Accordion type="single" collapsible={true} defaultValue={"item-1"}>
            <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="lex gap-2 py-2 px-4 hover:bg-green-800 cursor-pointer transition duration-300">
                    <SideBarAccordionItem name={page.name} icon={page.icon} />
                </AccordionTrigger>
                <AccordionContent>
                    <ul className="px-4">
                        {subPages}
                    </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>);
    }
}
export default function SideBarList() {

    var page_list = pages.map((page) => {
        return get_page_element(page as PageData);
    });

    return (
        <ul className="flex flex-col my-4 gap-2">
            {page_list}            
        </ul>
    )
}