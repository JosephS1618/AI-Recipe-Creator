import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import { InventoryFilters } from "@/components/inventory-filters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { UploadButton } from "@/components/upload-button";
import {
	type DeleteInventoryItem,
	type InventoryItem,
	type InventoryItemFilter,
	useAddInventoryItem,
	useAddInventoryItemsFromReceipt,
	useEditInventoryItem,
	useGetInventoryItems,
	useRemoveInventoryItem,
} from "@/query";

function formattedDate(value: string | null) {
	if (!value) return "";
	return value.slice(0, 10);
}

function dateFromToday(daysFromToday: number) {
	const date = new Date();
	date.setDate(date.getDate() + daysFromToday);
	return date.toISOString().slice(0, 10);
}

function InventoryItemList({
	inventoryId,
	item,
}: {
	inventoryId: string;
	item: InventoryItem;
}) {
	const editInventoryItem = useEditInventoryItem();
	const removeInventoryItem = useRemoveInventoryItem();

	const [quantity, setQuantity] = useState(item.quantity);
	const [creationDate, setCreationDate] = useState(
		formattedDate(item.creation_date),
	);
	const [expirationDate, setExpirationDate] = useState(
		formattedDate(item.expiration_date),
	);

	return (
		<TableRow>
			<TableCell>{item.ingredient_name}</TableCell>

			<TableCell>
				<Input
					type="number"
					min={0}
					value={quantity}
					onChange={(e) => setQuantity(Number(e.target.value))}
					className="w-24"
				/>
			</TableCell>

			<TableCell>
				<Input
					type="date"
					value={creationDate}
					onChange={(e) => setCreationDate(e.target.value)}
					className="min-w-36"
				/>
			</TableCell>

			<TableCell>
				<Input
					type="date"
					value={expirationDate}
					onChange={(e) => setExpirationDate(e.target.value)}
					className="min-w-36"
				/>
			</TableCell>

			<TableCell>
				<div className="flex flex-wrap gap-2">
					<Button
						variant="outline"
						onClick={() => {
							editInventoryItem.mutate({
								inventoryId,
								item: {
									inventory_item_id: item.inventory_item_id,
									inventory_id: inventoryId,
									ingredient_name: item.ingredient_name,
									quantity,
									creation_date: creationDate,
									expiration_date: expirationDate || null,
									receipt_id: item.receipt_id ?? null,
								},
							});
						}}
					>
						Update
					</Button>

					<Button
						variant="outline"
						className="text-destructive hover:text-destructive"
						onClick={() => {
							removeInventoryItem.mutate({
								inventoryId,
								item: {
									inventory_item_id: item.inventory_item_id,
									inventory_id: inventoryId,
								} as DeleteInventoryItem & { inventory_id: string },
							});
						}}
					>
						Delete
					</Button>
				</div>
			</TableCell>
		</TableRow>
	);
}

function InventoryItemsList({ inventoryId }: { inventoryId: string }) {
	const [filters, setFilters] = useState<InventoryItemFilter[]>([]);
	const { data: items = [] } = useGetInventoryItems(inventoryId, filters);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Inventory Items</CardTitle>
			</CardHeader>

			<CardContent>
				<InventoryFilters filters={filters} onChange={setFilters} />

				<hr className="mt-4" />

				{items.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						Added inventory items will show up here
					</p>
				) : (
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Ingredient Name</TableHead>
									<TableHead>Quantity</TableHead>
									<TableHead>Creation Date</TableHead>
									<TableHead>Expiration Date</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{items.map((item) => (
									<InventoryItemList
										key={`${item.inventory_id}-${item.inventory_item_id}`}
										inventoryId={inventoryId}
										item={item}
									/>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function AddInventoryItemCard({ inventoryId }: { inventoryId: string }) {
	const addInventoryItem = useAddInventoryItem();

	const today = useMemo(() => dateFromToday(0), []);
	const nextWeek = useMemo(() => dateFromToday(7), []);

	const [ingredientName, setIngredientName] = useState("");
	const [quantity, setQuantity] = useState(0);
	const [creationDate, setCreationDate] = useState(today);
	const [expirationDate, setExpirationDate] = useState(nextWeek);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Add Inventory Item</CardTitle>
				<p className="text-sm text-muted-foreground">
					Note: only items from the ingredients table can be added to inventory
				</p>
			</CardHeader>

			<CardContent className="grid gap-4 md:grid-cols-4">
				<div className="grid gap-2">
					<Label htmlFor="ingredient_name">Name</Label>
					<Input
						id="ingredient_name"
						value={ingredientName}
						placeholder="Ingredient Name"
						onChange={(e) => setIngredientName(e.target.value)}
					/>
				</div>

				<div className="grid gap-2">
					<Label htmlFor="quantity">Quantity</Label>
					<Input
						id="quantity"
						type="number"
						min={0}
						value={quantity}
						onChange={(e) => setQuantity(Number(e.target.value))}
					/>
				</div>

				<div className="grid gap-2">
					<Label htmlFor="creation_date">Creation Date</Label>
					<Input
						id="creation_date"
						type="date"
						value={creationDate}
						onChange={(e) => setCreationDate(e.target.value)}
					/>
				</div>

				<div className="grid gap-2">
					<Label htmlFor="expiration_date">Expiration Date</Label>
					<Input
						id="expiration_date"
						type="date"
						value={expirationDate}
						onChange={(e) => setExpirationDate(e.target.value)}
					/>
				</div>

				<div className="md:col-span-4">
					<Button
						onClick={() => {
							const trimmedIngredientName = ingredientName.trim();

							addInventoryItem.mutate(
								{
									inventoryId,
									item: {
										ingredient_name: trimmedIngredientName,
										quantity,
										creation_date: creationDate,
										expiration_date: expirationDate || null,
										receipt_id: null,
									},
								},
								{
									onSuccess: () => {
										setIngredientName("");
										setQuantity(0);
										setCreationDate(today);
										setExpirationDate(nextWeek);
									},
								},
							);
						}}
					>
						Add Inventory Item
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

export function InventoryDetail() {
	const { inventoryId } = useParams();
	const addInventoryItemsFromReceipt = useAddInventoryItemsFromReceipt();

	if (!inventoryId) {
		return <div>Inventory not found</div>;
	}

	return (
		<div className="px-4 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Inventory Detail
					</h1>
					<p className="mt-1 text-muted-foreground">
						Inventory ID: {inventoryId}
					</p>
				</div>

				<div className="flex items-center gap-2">
					<UploadButton
						text="Upload Receipt"
						disabled={addInventoryItemsFromReceipt.isPending}
						onUploaded={(fileName) => {
							const receiptToastId = toast.loading(
								"Receipt uploaded. Parsing receipt...",
							);

							addInventoryItemsFromReceipt.mutate(
								{
									inventoryId,
									input: { fileName },
								},
								{
									onSuccess: ({ createdItems, createdIngredientNames }) => {
										const itemCount = createdItems.length;
										const ingredientSummary =
											createdIngredientNames.length > 0
												? ` Created ${createdIngredientNames.length} new ingredient${
														createdIngredientNames.length === 1 ? "" : "s"
													}: ${createdIngredientNames.join(", ")}.`
												: "";

										toast.success(
											`Added ${itemCount} inventory item${
												itemCount === 1 ? "" : "s"
											} from receipt.${ingredientSummary}`,
											{ id: receiptToastId },
										);
									},
									onError: () => {
										toast.dismiss(receiptToastId);
									},
								},
							);
						}}
					/>

					<Button variant="outline">
						<Link to="/inventories">Back to Inventories</Link>
					</Button>
				</div>
			</div>

			<InventoryItemsList inventoryId={inventoryId} />
			{addInventoryItemsFromReceipt.isPending && (
				<p className="text-sm text-muted-foreground">
					Parsing receipt and adding inventory items...
				</p>
			)}
			<AddInventoryItemCard inventoryId={inventoryId} />
		</div>
	);
}
