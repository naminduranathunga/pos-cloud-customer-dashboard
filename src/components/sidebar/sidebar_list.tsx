import { BookDashed } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import pages from "@/assets/pages.json";
import { Link } from 'react-router-dom';

interface PageData {
    name: string;
    url: string;
    icon: string;
    subPages?: PageData[];
};

function get_page_element(page: PageData) {
    if (typeof (page.subPages) === 'undefined') {
        return (
            <li className="flex gap-2 py-2 px-4 hover:bg-green-800 cursor-pointer transition duration-300">
                <BookDashed />
                <Link to={page.url}>{page.name}</Link>
            </li>
        );
    } else {
        let sp = page.subPages as PageData[];
        console.log("DSD", sp);
        let subPages = sp.map((subPage) => get_page_element(subPage));
        return (<Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="lex gap-2 py-2 px-4 hover:bg-green-800 cursor-pointer transition duration-300">
                    <div className="flex gap-2 items-center"><BookDashed />
                    <span>{page.name}</span></div>
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
        <ul className="flex flex-col my-4">
            {page_list}            
        </ul>
    )
}