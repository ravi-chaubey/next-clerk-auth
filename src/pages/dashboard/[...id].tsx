import { useRouter } from "next/router";

export default function DashboardId() {
    const router = useRouter();
    const { id } = router.query;

    return (
      <div>
        this is dashboard page {id}
      </div>
    );
  }
  