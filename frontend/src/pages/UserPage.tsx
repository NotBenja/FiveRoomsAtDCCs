import { useEffect, useState } from "react";
import reservationAPI from "../services/reservationAPI";
import { getCurrentUser } from "../services/authAPI";
import { Button, Modal, ModalContent, ModalFooter, addToast, Tabs, Tab, Spinner } from "@heroui/react";
import type { Room, Reservation } from "../types/models.ts";
import "../App.css";
import UserReservationDashboard from "../components/reservations/UserReservationDashboard";
import ReservationBooking from "../components/reservations/ReservationBooking";
import RoomSchedule from "../components/rooms/RoomSchedule.tsx";

type Step = "schedule" | "confirm";

export default function UserPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContentReady, setModalContentReady] = useState(false);
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
    const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
    const [step, setStep] = useState<Step>("schedule");
    const [activeTab, setActiveTab] = useState("reservar");

    useEffect(() => {
        (async () => {
            setLoading(true);
            const [roomsData, reservationsData] = await Promise.all([
                reservationAPI.getRooms(),
                reservationAPI.getReservations()
            ]);
            setRooms(roomsData);
            setReservations(reservationsData);
            setLoading(false);
        })();
    }, []);

    const handleOpenReserve = (room: Room) => {
        setCurrentRoom(room);
        setSelectedBlock(null);
        setStep("schedule");
        setIsModalOpen(true);
        setModalContentReady(false);

        requestAnimationFrame(() => {
            setTimeout(() => {
                setModalContentReady(true);
            }, 150);
        });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalContentReady(false);
        setTimeout(() => {
            setCurrentRoom(null);
            setSelectedBlock(null);
            setStep("schedule");
        }, 200);
    };

    const handleReservationSubmit = async () => {
        if (!currentRoom || !selectedBlock) return;

        try {
            const resp = await getCurrentUser();
            const currentUser = resp?.user ?? null;

            if (!currentUser) {
                addToast({ title: "No hay usuario logueado", color: "danger" });
                return;
            }

            const newReservation = {
                roomID: currentRoom.id,
                userID: currentUser.id,
                time: selectedBlock,
                status: "pending"
            };

            const created = await reservationAPI.createReservation(newReservation);
            setReservations((prev) => [...prev, created]);
            handleCloseModal();

            addToast({
                title: "Reserva creada con éxito",
                description: `Reserva #${created.id} para ${currentUser.first_name} ${currentUser.last_name}`,
                color: "success",
            });
        } catch (err) {
            console.error("Error creando reserva", err);
            addToast({ title: "Error creando la reserva", color: "danger" });
        }
    };

    const steps = [
        { key: "schedule" as Step, title: "Elige el horario", enabled: true, done: Boolean(selectedBlock) },
        { key: "confirm" as Step, title: "Confirma tu reserva", enabled: Boolean(selectedBlock), done: false },
    ];

    const formatDate = (iso?: string | null) => {
        if (!iso) return "";
        const d = new Date(iso);
        return d.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" });
    }

    const formatBlock = (iso?: string | null) => {
        if (!iso) return "";
        const d = new Date(iso);
        return d.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", hour12: false });
    }

    return (
        <div className="p-6 w-max min-w-full min-h-screen bg-content1">
            <header className="mb-6 text-center">
                <h1 className="text-3xl font-bold title-conf">Reserva de salas del DCC</h1>
                <p className="subtitle-conf">Busca y reserva tu sala</p>
            </header>

            <div className="mx-auto w-full max-w-4xl">
                <Tabs
                    aria-label="Opciones de usuario"
                    selectedKey={activeTab}
                    onSelectionChange={(key) => setActiveTab(key as string)}
                    variant="underlined"
                    size="lg"
                    classNames={{
                        tabList: "w-full",
                        cursor: "bg-primary",
                        tab: "max-w-fit px-6 h-12",
                    }}
                >
                    <Tab key="reservar" title="Reservar Sala">
                        <ReservationBooking
                            rooms={rooms}
                            reservations={reservations}
                            loading={loading}
                            onReservePress={handleOpenReserve}
                        />
                    </Tab>

                    <Tab key="mis-reservas" title="Mis Reservas">
                        <div className="mt-6">
                            <UserReservationDashboard />
                        </div>
                    </Tab>
                </Tabs>
            </div>

            {currentRoom && (
                <Modal
                    isOpen={isModalOpen}
                    backdrop="blur"
                    placement="center"
                    onClose={handleCloseModal}
                    size="5xl"
                    classNames={{
                        base: "dark text-foreground bg-background",
                        backdrop: "blur"
                    }}
                >
                    <ModalContent>
                        {!modalContentReady ? (
                            <div className="flex items-center justify-center min-h-[70vh]">
                                <Spinner size="lg" label="Cargando horarios..." />
                            </div>
                        ) : (
                            <div className="flex flex-col md:flex-row min-h-[70vh]">
                                <aside className="md:w-64 w-full md:border-r border-default-100 p-3 md:p-4">
                                    <nav className="flex md:flex-col gap-2">
                                        {steps.map((s) => {
                                            const active = step === s.key;
                                            return (
                                                <Button
                                                    key={s.key}
                                                    variant={active ? "solid" : "flat"}
                                                    color={active ? "primary" : "default"}
                                                    className="justify-start"
                                                    isDisabled={!s.enabled}
                                                    onPress={() => setStep(s.key)}
                                                >
                                                    <span className="mr-2">{s.title}</span>
                                                    {s.done && <span aria-hidden>✓</span>}
                                                </Button>
                                            );
                                        })}
                                    </nav>

                                    <div className="mt-6 text-sm text-foreground-500 space-y-1">
                                        <div><span className="font-semibold">Sala:</span> {currentRoom.room_name}</div>
                                        <div><span className="font-semibold">Fecha:</span> {formatDate(selectedBlock)}</div>
                                        <div><span className="font-semibold">Bloque:</span> {formatBlock(selectedBlock)}</div>
                                    </div>
                                </aside>

                                <main className="flex-1 p-4 md:p-6">
                                    {step === "schedule" && (
                                        <div className="flex-1 h-[65vh] overflow-auto">
                                            <RoomSchedule
                                                onClickBlock={(blockId: string) => { setSelectedBlock(blockId); }}
                                                room={currentRoom}
                                            />
                                        </div>
                                    )}

                                    {step === "confirm" && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold">Revisa y confirma tu reserva</h3>
                                            <div className="rounded-lg border border-default-200 p-4 space-y-2">
                                                <div><span className="font-semibold">Sala:</span> {currentRoom.room_name}</div>
                                                <div><span className="font-semibold">Fecha:</span> {formatDate(selectedBlock)}</div>
                                                <div><span className="font-semibold">Horario:</span> {formatBlock(selectedBlock)}</div>
                                            </div>
                                            <p className="text-sm text-foreground-500">
                                                La reserva se creará a tu nombre con la información de tu cuenta.
                                            </p>
                                        </div>
                                    )}
                                </main>
                            </div>
                        )}
                        <ModalFooter>
                            {step === "schedule" && (
                                <>
                                    <Button variant="flat" onPress={handleCloseModal}>Cancelar</Button>
                                    <Button
                                        color="primary"
                                        onPress={() => setStep("confirm")}
                                        isDisabled={!selectedBlock}
                                    >
                                        Continuar
                                    </Button>
                                </>
                            )}

                            {step === "confirm" && (
                                <>
                                    <Button variant="flat" onPress={() => setStep("schedule")}>Atrás</Button>
                                    <Button
                                        color="primary"
                                        onPress={() => void handleReservationSubmit()}
                                        isDisabled={!currentRoom || !selectedBlock}
                                    >
                                        Confirmar reserva
                                    </Button>
                                </>
                            )}
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </div>
    );
}
