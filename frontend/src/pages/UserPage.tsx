import { useEffect, useState } from "react";
import ReservationForm, { type ReserveFormValues } from "../components/reservations/ReservationForm.tsx";
import reservationAPI from "../services/reservationAPI.ts";
import RoomSchedule from "../components/rooms/RoomSchedule.tsx";
import { Button, Modal, ModalContent, ModalFooter, addToast, Tabs, Tab } from "@heroui/react";
import type { Room, Reservation, User } from "../types/models.ts";
import "../App.css";
import UserReservationDashboard from "../components/reservations/UserReservationDashboard";
import ReservationBooking from "../components/reservations/ReservationBooking";

type Step = "schedule" | "form" | "confirm";

export default function UserPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
    const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
    const [formData, setFormData] = useState<ReserveFormValues | null>(null);
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
        setFormData(null);
        setStep("schedule");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentRoom(null);
        setSelectedBlock(null);
        setFormData(null);
        setStep("schedule");
    };

    const handleReservationSubmit = async (data: ReserveFormValues, room: Room, block?: string) => {
        if (!block) return;

        const userData: User[] = await reservationAPI.getUsers();
        const newUserID = userData.length > 0 ? Math.max(...userData.map(u => u.id)) + 1 : 1;

        const newUser: User = {
            id: newUserID,
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            password: "defaultPassword123"
        }

        const newReservation: Omit<Reservation, "id"> = {
            roomID: room.id,
            userID: newUserID,
            time: block,
            status: "pendiente"
        };

        try {
            await reservationAPI.createUser(newUser);
            const created = await reservationAPI.createReservation(newReservation);
            setReservations((prev) => [...prev, created]);
            handleCloseModal();
            addToast({
                title: "Reserva creada con éxito",
                description: `Reserva #${created.id} • Usuario #${newUserID}: ${data.firstName} ${data.lastName}`,
                color: "success",
            });
        } catch (err) {
            console.error("Error creando reserva", err);
            addToast({ title: "Error creando la reserva", color: "danger" });
        }
    };

    const steps = [
        { key: "schedule" as Step, title: "Elige el horario", enabled: true, done: Boolean(selectedBlock) },
        { key: "form" as Step, title: "Ingresa tus datos", enabled: Boolean(selectedBlock), done: Boolean(formData) },
        { key: "confirm" as Step, title: "Confirma tu reserva", enabled: Boolean(selectedBlock && formData), done: false },
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
                                    {formData && (
                                        <>
                                            <div><span className="font-semibold">Nombre:</span> {formData.firstName}</div>
                                            <div><span className="font-semibold">Apellido:</span> {formData.lastName}</div>
                                            <div><span className="font-semibold">Correo:</span> {formData.email}</div>
                                        </>
                                    )}
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
                                {step === "form" && (
                                    <div className="max-w-lg">
                                        <ReservationForm
                                            room={currentRoom}
                                            selectedBlock={selectedBlock ?? undefined}
                                            submitLabel="Guardar y continuar"
                                            submittingText="Guardando..."
                                            onCancel={() => setStep("schedule")}
                                            onSubmit={(data) => {
                                                setFormData(data);
                                                setStep("confirm");
                                            }}
                                        />
                                    </div>
                                )}

                                {step === "confirm" && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-semibold">Revisa y confirma</h3>
                                        <div className="rounded-lg border p-4 space-y-2">
                                            <div><span className="font-semibold">Sala:</span> {currentRoom.room_name}</div>
                                            <div><span className="font-semibold">Horario:</span> {formatDate(selectedBlock)} • {formatBlock(selectedBlock)}</div>
                                            <div><span className="font-semibold">Nombre:</span> {formData?.firstName}</div>
                                            <div><span className="font-semibold">Apellido:</span> {formData?.lastName}</div>
                                            <div><span className="font-semibold">Correo:</span> {formData?.email}</div>
                                        </div>
                                        <p className="text-sm text-foreground-500">
                                            Si necesitas cambiar algo, usa las pestañas de la izquierda para volver al paso correspondiente.
                                        </p>
                                    </div>
                                )}
                            </main>
                        </div>
                        <ModalFooter>
                            {step === "schedule" && (
                                <>
                                    <Button variant="flat" onPress={handleCloseModal}>Cancelar</Button>
                                    <Button color="primary" onPress={() => setStep("form")} isDisabled={!selectedBlock}>
                                        Continuar
                                    </Button>
                                </>
                            )}

                            {step === "form" && (
                                <>
                                    <Button variant="flat" onPress={() => setStep("schedule")}>Volver</Button>
                                </>
                            )}

                            {step === "confirm" && (
                                <>
                                    <Button variant="flat" onPress={() => setStep("form")}>Atrás</Button>
                                    <Button
                                        color="primary"
                                        onPress={() => {
                                            if (currentRoom && selectedBlock && formData) {
                                                void handleReservationSubmit(formData, currentRoom, selectedBlock);
                                            }
                                        }}
                                        isDisabled={!currentRoom || !selectedBlock || !formData}
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
