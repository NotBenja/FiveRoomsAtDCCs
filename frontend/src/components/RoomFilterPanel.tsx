import React, {useState} from "react";
import {Slider, Button, ButtonGroup} from "@heroui/react";

interface FilterProps {
    onMaxCapacityChange: (maxCapacity: [number, number]) => void;
    onProjectorSettingsChange: (value: boolean | null) => void;
}

const RoomFilterPanel: React.FC<FilterProps> = ({onMaxCapacityChange, onProjectorSettingsChange}) => {
    const [maxCapacity, setMaxCapacity] = useState<[number, number]>([0, 100])
    const [hasProjector, setHasProjector] = useState<boolean | null>(null)

    const handleMaxCapacityChange = (maxCapacity: [number, number]) => {
        setMaxCapacity(maxCapacity)
        onMaxCapacityChange(maxCapacity)
    }
    const handleProjectorSettingsChange = (value: boolean | null) => {
        setHasProjector(value)
        onProjectorSettingsChange(value)
    }
    return (
        <div className="room-filter-panel">
            <div className="room-capacity-slider">
                <div className="flex flex-col gap-2 w-full h-full max-w-md items-start justify-center">
                    <Slider
                        className="max-w-md"
                        label="Select the room max capacity0"
                        maxValue={1000}
                        minValue={0}
                        step={10}
                        value={maxCapacity}
                        onChange={handleMaxCapacityChange}
                    />
                    <p className="text-default-500 font-medium text-small">
                        Selected budget: {Array.isArray(maxCapacity) && maxCapacity.map((b) => `${b}`).join(" – ")}
                    </p>
                </div>
            </div>

            <div className="projector-selector">
                <ButtonGroup radius="full">
                    <Button color={hasProjector === null ? "primary" : "default"} onPress={() => handleProjectorSettingsChange(null)}>All</Button>
                    <Button color={hasProjector === true ? "success" : "default"} onPress={() => handleProjectorSettingsChange(true)}>Yes</Button>
                    <Button color={hasProjector === false ? "danger" : "default"} onPress={() => handleProjectorSettingsChange(false)}>No</Button>
                </ButtonGroup>
            </div>
        </div>
    )
}

export default RoomFilterPanel