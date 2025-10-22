import ClientLayout from "@/components/ClientLayout";
import ServerLayout from "@/components/ServerLayout";
export default function Page() {
    return (
        <ClientLayout>
            <ServerLayout />
        </ClientLayout>
    );
}