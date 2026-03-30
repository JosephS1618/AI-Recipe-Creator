import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type {
	InventoryItemFilter,
	InventoryItemFilterAttribute,
} from "@/query";

const FILTER_ATTRIBUTE_OPTIONS: {
	label: string;
	value: InventoryItemFilterAttribute;
}[] = [
	{ label: "Ingredient Name", value: "ingredient_name" },
	{ label: "Quantity", value: "quantity" },
	{ label: "Creation Date", value: "creation_date" },
	{ label: "Expiration Date", value: "expiration_date" },
	{ label: "Receipt ID", value: "receipt_id" },
];

function createFilterItem(): InventoryItemFilter {
	return {
		attribute: "ingredient_name",
		value: "",
	};
}

function getFilterInputType(attribute: InventoryItemFilterAttribute) {
	switch (attribute) {
		case "creation_date":
		case "expiration_date":
			return "date";
		case "quantity":
			return "number";
		default:
			return "text";
	}
}

function FilterRow({
	filter,
	showJoin,
	disabled,
	onChange,
	action,
}: {
	filter: InventoryItemFilter;
	showJoin: boolean;
	disabled?: boolean;
	onChange?: (nextFilter: InventoryItemFilter) => void;
	action?: ReactNode;
}) {
	return (
		<div className="flex items-center gap-2">
			{showJoin && (
				<div className="text-sm text-muted-foreground">
					{filter.isOR ? "OR" : "AND"}
				</div>
			)}

			<Select
				value={filter.attribute}
				disabled={disabled}
				onValueChange={(value) =>
					onChange?.({
						...filter,
						attribute: value as InventoryItemFilterAttribute,
					})
				}
			>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="Attribute" />
				</SelectTrigger>
				<SelectContent>
					{FILTER_ATTRIBUTE_OPTIONS.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<div className="text-sm text-muted-foreground">IS</div>

			<Input
				type={getFilterInputType(filter.attribute)}
				value={filter.value}
				placeholder="Value"
				disabled={disabled}
				onChange={(e) =>
					onChange?.({
						...filter,
						value: e.target.value,
					})
				}
			/>

			{action}
		</div>
	);
}

export function InventoryFilters({
	filters,
	onChange,
}: {
	filters: InventoryItemFilter[];
	onChange: (filters: InventoryItemFilter[]) => void;
}) {
	const [draftFilter, setDraftFilter] = useState(createFilterItem());
	const isDraftEmpty = draftFilter.value.trim().length === 0;

	function addFilter(isOR?: boolean) {
		onChange([...filters, isOR ? { ...draftFilter, isOR: true } : draftFilter]);
		setDraftFilter(createFilterItem());
	}

	return (
		<div className="space-y-3">
			<h3 className="text-sm">Filters</h3>

			<div className="space-y-3">
				{filters.map((filter, index) => (
					<FilterRow
						key={`${filter.attribute}_${filter.value}`}
						filter={filter}
						showJoin={index > 0}
						disabled
						action={
							<Button
								type="button"
								variant="outline"
								className="text-destructive"
								onClick={() =>
									onChange(
										filters.filter((_, currentIndex) => currentIndex !== index),
									)
								}
							>
								Remove
							</Button>
						}
					/>
				))}

				<FilterRow
					filter={draftFilter}
					showJoin={false}
					onChange={setDraftFilter}
					action={
						filters.length === 0 ? (
							<Button
								type="button"
								disabled={isDraftEmpty}
								onClick={() => addFilter()}
							>
								Add
							</Button>
						) : (
							<div className="flex gap-2">
								<Button
									type="button"
									disabled={isDraftEmpty}
									onClick={() => addFilter()}
								>
									+ AND
								</Button>
								<Button
									type="button"
									variant="outline"
									disabled={isDraftEmpty}
									onClick={() => addFilter(true)}
								>
									+ OR
								</Button>
							</div>
						)
					}
				/>
			</div>
		</div>
	);
}
