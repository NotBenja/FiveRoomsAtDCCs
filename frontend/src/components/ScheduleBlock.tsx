import {addToast, Card, CardBody, CardHeader} from "@heroui/react";
import React from "react";

interface ScheduleBlockProps {
    onClickBlock: () => void;
    block: string;
    reserved: boolean;
    selected: boolean;
}

const ScheduleBlock: React.FC<ScheduleBlockProps> = ({ onClickBlock, block, reserved, selected }) => {
    return (
        <div className="schedule-block w-full h-full">
            <Card className="w-full h-full" classNames={{base : reserved===true
                ? "bg-red-500 text-white"
                : (selected
                ? "block-color text-white"
                : "text-block-color hover:scale-[1.02] hover:shadow-lg transition-all duration-200 ease-in-out")}}
                  isPressable={true}
                  onPress={() => reserved === true ? addToast({title: "This block is already reserved" }) : onClickBlock()}>
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-center justify-center">
                    <p className="text-tiny uppercase font-bold">{block}</p>
                    <h4 className="font-bold text-large">{reserved}</h4>
                </CardHeader>
                <CardBody>

                </CardBody>
            </Card>
        </div>
    )
}

export default ScheduleBlock;