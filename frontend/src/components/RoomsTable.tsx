import {useEffect, useMemo, useState} from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Input, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  Chip, Pagination, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Checkbox
} from "@heroui/react";
import salasAPI from "../services/salas";
import type { Sala } from "../types/models";
import type {Selection} from "@react-types/shared";

const FEATURE_FIELDS = [
  { key: "proyector",   label: "Proyector",   get: (s: Sala) => s.caracteristicas.tiene_proyector },
  { key: "pizarra",     label: "Pizarra",     get: (s: Sala) => s.caracteristicas.tiene_pizarra },
  { key: "audio",       label: "Audio",       get: (s: Sala) => s.caracteristicas.tiene_audio },
  { key: "ventilacion", label: "Ventilación", get: (s: Sala) => s.caracteristicas.tiene_ventilacion },
] as const;

type FeatureKey = typeof FEATURE_FIELDS[number]["key"];
//color y a chip para heroui
const boolChip = (v: boolean) => (
  <Chip size="sm" variant="flat" color={v ? "success" : "default"}>
    {v ? "Sí" : "No"}
  </Chip>
);

export default function RoomsTable() {
  const [rooms, setRooms] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);

  // toolbar
  const [filter, setFilter] = useState("");
  const [features, setFeatures] = useState<Selection>(new Set([]));
  const [page, setPage] = useState(1);

  // modal (crear / editar)
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Sala | null>(null);
  const [formName, setFormName] = useState("");
  const [formCap, setFormCap] = useState<number>(10);
  const [formProj, setFormProj] = useState(true);
  const [formBoard, setFormBoard] = useState(true);
  const [formAudio, setFormAudio] = useState(false);
  const [formVent, setFormVent] = useState(true);

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const data = await salasAPI.getSalas();
        setRooms(data);
      } catch (err) {
        console.error("Error cargando salas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalas();
  }, []);

  // filtrado
  const filtered = useMemo<Sala[]>(() => {
    let list = rooms;

    const q = filter.trim().toLowerCase();
    if (q) list = list.filter((s) => s.nombre.toLowerCase().includes(q));

    const selected = features === "all" ? [] : (Array.from(features) as FeatureKey[]);
    if (selected.length) {
      list = list.filter((s) =>
        selected.every((k) => FEATURE_FIELDS.find(f => f.key === k)!.get(s))
      );
    }
    return list;
  }, [rooms, filter, features]);

  const pages = Math.max(1, Math.ceil(filtered.length / 5));
  const pageItems = useMemo<Sala[]>(() => {
    const start = (page - 1) * 5;
    return filtered.slice(start, start + 5);
  }, [filtered, page]);

  // acciones
  const openCreate = () => {
    setEditing(null);
    setFormName("");
    setFormCap(10);
    setFormProj(true);
    setFormBoard(true);
    setFormAudio(false);
    setFormVent(true);
    setOpen(true);
  };

  const openEdit = (s: Sala) => {
    setEditing(s);
    setFormName(s.nombre);
    setFormCap(s.caracteristicas.cap_max);
    setFormProj(s.caracteristicas.tiene_proyector);
    setFormBoard(s.caracteristicas.tiene_pizarra);
    setFormAudio(s.caracteristicas.tiene_audio);
    setFormVent(s.caracteristicas.tiene_ventilacion);
    setOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim() || formCap <= 0) return;

    if (editing) {
      // editar
      const updated: Sala = {
        ...editing,
        nombre: formName.trim(),
        caracteristicas: {
          cap_max: formCap,
          tiene_proyector: formProj,
          tiene_pizarra: formBoard,
          tiene_audio: formAudio,
          tiene_ventilacion: formVent,
        },
        horarios: editing.horarios,
      };
      try {
        const saved = await salasAPI.updateSala(updated);
        setRooms((prev) => prev.map((s) => (s.id === saved.id ? saved : s)));
        setOpen(false);
      } catch (e) {
        console.error("Error actualizando sala:", e);
      }
    } else {
      // crear
      const nueva: Omit<Sala, "id"> = {
        nombre: formName.trim(),
        caracteristicas: {
          cap_max: formCap,
          tiene_proyector: formProj,
          tiene_pizarra: formBoard,
          tiene_audio: formAudio,
          tiene_ventilacion: formVent,
        },
        horarios: { reservas: [] },
      };

      const creada = await salasAPI.createSala(nueva);
      setRooms((prev) => [...prev, creada]);
      setOpen(false);
    }
  };

  const handleDelete = async (id: number) => {
    await salasAPI.deleteSala(id);
    setRooms((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) return <div className="p-8 text-center">Cargando salas…</div>;

  return (
    <>
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{ base: "w-full sm:max-w-[44%]", inputWrapper: "border-1" }}
            placeholder="Buscar sala..."
            size="sm"
            value={filter}
            variant="bordered"
            onClear={() => setFilter("")}
            onValueChange={(v) => { setFilter(v); setPage(1); }}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger>
                <Button size="sm" variant="flat">Filtros</Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Filtrar por características"
                closeOnSelect={false}
                selectionMode="multiple"
                selectedKeys={features}
                onSelectionChange={setFeatures}
              >
                {FEATURE_FIELDS.map(f => (
                  <DropdownItem key={f.key}>{f.label}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Button className="bg-foreground text-background" size="sm" onPress={openCreate}>
              Añadir Sala
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Hay {filtered.length} salas.</span>
        </div>
      </div>

      {/*tabla*/}
      <Table aria-label="Rooms table">
        <TableHeader>
          <TableColumn>NOMBRE</TableColumn>
          <TableColumn>CAPACIDAD</TableColumn>
          <TableColumn>PROYECTOR</TableColumn>
          <TableColumn>PIZARRA</TableColumn>
          <TableColumn>AUDIO</TableColumn>
          <TableColumn>VENTILACIÓN</TableColumn>
          <TableColumn>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No se encontraron salas."}>
          {pageItems.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-medium">{s.nombre}</TableCell>
              <TableCell className="tabular-nums">{s.caracteristicas.cap_max}</TableCell>
              <TableCell>{boolChip(s.caracteristicas.tiene_proyector)}</TableCell>
              <TableCell>{boolChip(s.caracteristicas.tiene_pizarra)}</TableCell>
              <TableCell>{boolChip(s.caracteristicas.tiene_audio)}</TableCell>
              <TableCell>{boolChip(s.caracteristicas.tiene_ventilacion)}</TableCell>
              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button size="sm" variant="bordered">Modificar</Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Acciones de sala"
                    onAction={(action) => {
                      if (action === "edit") openEdit(s);
                      if (action === "delete") handleDelete(s.id);
                    }}
                  >
                    <DropdownItem key="edit">Editar</DropdownItem>
                    <DropdownItem key="delete" className="text-danger">Borrar</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{ cursor: "bg-foreground text-background" }}
          color="default"
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          Página {page} de {pages}
        </span>
      </div>

      {/* modal crear y editar */}
      <Modal isOpen={open} onOpenChange={setOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{editing ? "Editar Sala" : "Nueva Sala"}</ModalHeader>
              <ModalBody>
                <Input label="Nombre" value={formName} onValueChange={setFormName} />
                <Input label="Capacidad" type="number" min={1} value={String(formCap)} onChange={(e) => setFormCap(Number(e.target.value))} />
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Checkbox isSelected={formProj} onValueChange={setFormProj}>Proyector</Checkbox>
                  <Checkbox isSelected={formBoard} onValueChange={setFormBoard}>Pizarra</Checkbox>
                  <Checkbox isSelected={formAudio} onValueChange={setFormAudio}>Audio</Checkbox>
                  <Checkbox isSelected={formVent} onValueChange={setFormVent}>Ventilación</Checkbox>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Cancelar</Button>
                <Button className="bg-foreground text-background" onPress={handleSave}>
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}