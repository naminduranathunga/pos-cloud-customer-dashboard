import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import pages from "@/assets/pages.json";
import SideBarItem from "./sidebar_item";
import SideBarAccordionItem from "./sidebar_item_accordion";
import has_user_permissions from "@/lib/has_permissions";
import useFlexaroUser from "@/lib/hooks/flexaro_user";

interface PageData {
    name: string;
    url: string;
    icon: string;
    permissions?: string[];
    subPages?: PageData[];
};


function get_page_element(page: PageData, user:any, key?: number) {
    if (page.permissions && page.permissions.length > 0) {
        if (!has_user_permissions(user, page.permissions)) {
            return null;
        }
    }
    if (typeof (page.subPages) === 'undefined') {
        return (
            <SideBarItem name={page.name} url={page.url} icon={page.icon} key={key} />
        );
    } else {
        let sp = page.subPages as PageData[];
        let subPages = sp.map((subPage, index) => get_page_element(subPage, user, index));
        return (<Accordion type="single" collapsible={true} defaultValue={"item-1"} key={key}>
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
    const { user } = useFlexaroUser();

    var page_list = pages.map((page, index) => {
        return get_page_element(page as PageData, user, index);
    });


    return (
        <ul className="flex flex-col my-4 gap-2">
            {page_list}            
        </ul>
    )
}