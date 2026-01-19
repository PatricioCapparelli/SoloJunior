"use client";

import { useState, useTransition } from "react";
import { Flag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { reportJob } from "@/actions/reportJobAction";
import { toast } from "sonner"; 

export default function ReportJobButton({ jobId }: { jobId: string }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");

    const handleSubmit = () => {
        if (!reason) return;

        startTransition(async () => {
            const result = await reportJob(jobId, reason, details);
            if (result.success) {
                setOpen(false);
                toast.success("Reporte enviado"); 
            } else {
                alert("Error al enviar reporte.");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">
                    <Flag className="w-4 h-4 mr-2" />
                    Reportar Oferta
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reportar Oferta</DialogTitle>
                    <DialogDescription>
                        Ayudanos a mantener la comunidad segura. ¿Qué pasa con esta oferta?
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Motivo</Label>
                        <Select onValueChange={setReason}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccioná un motivo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="spam">Es Spam / Publicidad</SelectItem>
                                <SelectItem value="fake">Es falsa / Estafa</SelectItem>
                                <SelectItem value="seniority">Pide mucha experiencia (+3 años)</SelectItem>
                                <SelectItem value="offensive">Contenido ofensivo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Detalles (Opcional)</Label>
                        <Textarea
                            placeholder="Contanos más..."
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!reason || isPending}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar Reporte"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}