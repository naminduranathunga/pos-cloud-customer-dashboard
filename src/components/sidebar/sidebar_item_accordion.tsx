import { icons } from 'lucide-react';


export default function SideBarAccordionItem({name, icon}:{name: string, icon: string}) {
    var Icon_;
    if (icon in icons){
        Icon_ = icons[icon as keyof typeof icons];
    } else{
        Icon_ = icons['BookDashed'];
    }
    const Icon = Icon_;
    return (
        <div className="flex gap-2 items-center">
            <Icon />
            <span>{name}</span>
        </div>
    )
}