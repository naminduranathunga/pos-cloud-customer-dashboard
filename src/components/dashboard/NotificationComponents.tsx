import { Bell } from "lucide-react";


export default function NotificationComponent(){
    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <h3 className="font-semibold text-2xl flex items-center gap-2"><Bell size={"0.8em"} /> Notifications</h3>
            <div className="text-gray-400 mb-6">You don't have any notifications.</div>

            <ul>
                <li className="py-3">
                    <strong>text Solutionnname - main.</strong>
                    <div className="text-gray-400">sample description</div>
                </li>
                <li className="py-3">
                    <strong>text Solutionnname - main.</strong>
                    <div className="text-gray-400">sample description</div>
                </li>
                <li className="py-3">
                    <strong>text Solutionnname - main.</strong>
                    <div className="text-gray-400">sample description</div>
                </li>
                <li className="py-3">
                    <strong>text Solutionnname - main.</strong>
                    <div className="text-gray-400">sample description</div>
                </li>
            </ul>
        </div>
    )
}