import {Card, CardBody, Skeleton} from "@heroui/react";
import "../App.css";

export default function RoomCardSkeleton() {
    return (
        <Card
            radius="lg"
            className={[
                "room-card",
                "room-skeleton-card",
                "bg-content1",
                "shadow-sm"
            ].join(" ")}
            style={{
                borderColor: "rgba(15, 23, 42, 0.08)",
                overflow: "hidden",
                isolation: "isolate",
            }}
        >
            <div className="room-accent" aria-hidden />

            <CardBody className="p-4 md:p-5">
                <div className="flex items-start gap-4">
                    <Skeleton className="rounded-2xl shrink-0 bg-default-200">
                        <div
                            className="room-thumb rounded-2xl border"
                            style={{ borderColor: "rgba(15, 23, 42, 0.08)" }}
                        />
                    </Skeleton>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                            <Skeleton className="rounded-lg max-w-[220px] bg-default-200">
                                <div className="h-5 w-[200px] rounded-lg" />
                            </Skeleton>

                            <Skeleton className="rounded-full shrink-0 bg-default-300">
                                <div className="h-8 w-24 rounded-full" />
                            </Skeleton>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2">
                            <Skeleton className="rounded-full bg-default-200">
                                <div className="h-6 w-28 rounded-full" />
                            </Skeleton>
                            <Skeleton className="rounded-full bg-default-200">
                                <div className="h-6 w-20 rounded-full" />
                            </Skeleton>
                            <Skeleton className="rounded-full bg-default-200">
                                <div className="h-6 w-16 rounded-full" />
                            </Skeleton>
                            <Skeleton className="rounded-full bg-default-200">
                                <div className="h-6 w-20 rounded-full" />
                            </Skeleton>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
