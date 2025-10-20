import {
    Card,
    CardHeader,
    CardBody,
    Accordion,
    AccordionItem,
    Skeleton,
    Button,
    Tooltip
} from "@heroui/react";
import '../../App.css';

export default function RoomFilterPanelSkeleton() {
    return (
        <Card className="w-full">
            <CardHeader className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">Filtros</h3>
                </div>
                <Button size="sm" variant="flat" isDisabled>
                    Limpiar
                </Button>
            </CardHeader>

            <CardBody className="flex flex-col">
                <Accordion selectionMode="multiple" defaultExpandedKeys={[]} variant="splitted" className="w-full" isDisabled={true}>
                    <AccordionItem key="filtros" aria-label="Mostrar filtros" isDisabled
                        title={
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Mostrar filtros</span>
                                <Tooltip content="Ajusta capacidad y características" placement="top" showArrow>
                                    <span className="text-default-400 text-small cursor-help">ⓘ</span>
                                </Tooltip>
                            </div>
                        }
                        subtitle={
                            <div className="text-default-500 text-small inline-flex items-center gap-2">
                                <span>Capacidad:</span>
                                <Skeleton className="h-4 w-24 rounded" />
                            </div>
                        }>
                    </AccordionItem>
                </Accordion>
            </CardBody>
        </Card>
    );
}