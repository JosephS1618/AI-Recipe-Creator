import { useParams } from "react-router";

export function InventoryDetail() {
	const { inventoryId } = useParams();

	return <div>{inventoryId}</div>;
}
