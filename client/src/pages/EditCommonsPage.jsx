import PageContent from "../components/UI/PageContent";
import { useSelector } from "react-redux";

export default function EditCommonsPage () {
    const selectedLog = useSelector((state) => state.myLogs.currentLogFilter);
    const capitalizedLogName = selectedLog.charAt(0).toUpperCase() + selectedLog.slice(1);
    const title = `Edit Commons (${capitalizedLogName}s)`;

    return (
        <PageContent title={title}>
            <EditCommonsForm />
        </PageContent>
    )
}