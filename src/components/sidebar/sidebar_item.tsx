import { icons } from 'lucide-react';
import { Link } from 'react-router-dom';


export default function SideBarItem({name, url, icon}:{name: string, url: string, icon: string}) {
    var Icon_;
    if (icon in icons){
        Icon_ = icons[icon as keyof typeof icons];
    } else{
        Icon_ = icons['BookDashed'];
    }
    const Icon = Icon_;
    return (
        <li className="flex gap-2 py-2 px-4 hover:bg-green-800 cursor-pointer transition duration-300">
            <Icon />
            <Link to={url}>{name}</Link>
        </li>
    )
}