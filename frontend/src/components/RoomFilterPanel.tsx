import { Slider, Button, ButtonGroup, Card, CardHeader, Chip, CardBody, Accordion, AccordionItem, Tooltip } from "@heroui/react";
import type { RoomFilters } from "../types/models.ts";

interface FilterProps {
    value: RoomFilters;
    onChange: (next: RoomFilters) => void;
    minCapacity?: number;
    maxCapacity?: number;
}

const feats: { key: keyof RoomFilters; label: string }[] = [
    { key: "hasProjector",  label: "Proyector" },
    { key: "hasWhiteboard", label: "Pizarra" },
    { key: "hasAudio",   label: "Parlantes" },
    { key: "hasVentilation",label: "Ventilación" },
];

function RoomFilterPanel({ value, onChange, minCapacity = 0, maxCapacity = 1000 }: FilterProps) {
    const { capacityRange } = value;

    const activeCount =
        (capacityRange[0] !== minCapacity || capacityRange[1] !== maxCapacity ? 1 : 0) +
        (feats as { key: keyof RoomFilters }[]).filter(({ key }) => value[key] !== null).length;

    const resetFilters = () =>
        onChange({
            capacityRange: [minCapacity, maxCapacity],
            hasProjector: null,
            hasWhiteboard: null,
            hasAudio: null,
            hasVentilation: null,
        });

    // Tri-estado: true/false/null (clic en el mismo estado vuelve a null)
    const setFeature = (key: keyof RoomFilters, desired: boolean) => {
        const current = value[key] as boolean | null;
        const next = current === desired ? null : desired;
        onChange({ ...value, [key]: next });
    };

    const Group = ({
                       label,
                       current,
                       onYes,
                       onNo,
                   }: {
        label: string;
        current: boolean | null;
        onYes: () => void;
        onNo: () => void;
    }) => (
        <div className="flex items-center justify-between gap-3">
            <span className="font-medium">{label}</span>
            <ButtonGroup radius="full" size="sm" variant="flat">
                <Button color={current === true ? "success" : "default"} onPress={onYes}>Sí</Button>
                <Button color={current === false ? "danger" : "default"} onPress={onNo}>No</Button>
            </ButtonGroup>
        </div>
    );

    return (
        <Card className="w-full">
            <CardHeader className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">Filtros</h3>
                    {activeCount > 0 && (
                        <Chip size="sm" color="primary" variant="flat">
                            {activeCount} activo{activeCount === 1 ? "" : "s"}
                        </Chip>
                    )}
                </div>
                <Button size="sm" variant="flat" onPress={resetFilters}>
                    Limpiar
                </Button>
            </CardHeader>

            <CardBody className="flex flex-col">
                <Accordion selectionMode="multiple" defaultExpandedKeys={[]} variant="splitted" className="w-full">
                    <AccordionItem
                        key="filtros"
                        aria-label="Mostrar filtros"
                        title={
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Mostrar filtros</span>
                                <Tooltip content="Ajusta capacidad y características" placement="top" showArrow>
                                    <span className="text-default-400 text-small cursor-help">ⓘ</span>
                                </Tooltip>
                            </div>
                        }
                        subtitle={
                            <span className="text-default-500 text-small">
                Capacidad: {capacityRange[0]} – {capacityRange[1]}
              </span>
                        }
                    >
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Capacidad</span>
                                    <span className="text-default-500 text-small">
                    {capacityRange[0]} – {capacityRange[1]}
                  </span>
                                </div>
                                <Slider
                                    aria-label="Capacidad máxima de la sala"
                                    minValue={minCapacity}
                                    maxValue={maxCapacity}
                                    step={1}
                                    value={capacityRange}
                                    className="max-w-full"
                                    onChange={(v) => {
                                        if (Array.isArray(v) && v.length === 2) {
                                            onChange({ ...value, capacityRange: v as [number, number] });
                                        }
                                    }}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {feats.map(({ key, label }) => (
                                    <Group
                                        key={String(key)}
                                        label={label}
                                        current={value[key] as boolean | null}
                                        onYes={() => setFeature(key, true)}
                                        onNo={() => setFeature(key, false)}
                                    />
                                ))}
                            </div>
                        </div>
                    </AccordionItem>
                </Accordion>
            </CardBody>
        </Card>
    );
}

export default RoomFilterPanel;
