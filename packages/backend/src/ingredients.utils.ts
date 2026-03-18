export class NormalizedNameMap<TValue> {
	private readonly valuesByName = new Map<string, TValue>();

	private static normalizeName(name: string): string {
		return name.trim().toLowerCase();
	}

	static uniqueNames(names: readonly string[]): string[] {
		const lookup = new NormalizedNameMap<string>();

		for (const name of names) {
			const trimmedName = name.trim();

			if (!trimmedName) {
				continue;
			}

			lookup.set(trimmedName, trimmedName);
		}

		return Array.from(lookup.valuesByName.values());
	}

	static fromItems<TItem, TValue>(
		items: readonly TItem[],
		getName: (item: TItem) => string,
		getValue: (item: TItem) => TValue,
	): NormalizedNameMap<TValue> {
		const lookup = new NormalizedNameMap<TValue>();

		for (const item of items) {
			lookup.set(getName(item), getValue(item));
		}

		return lookup;
	}

	has(name: string): boolean {
		return this.valuesByName.has(NormalizedNameMap.normalizeName(name));
	}

	get(name: string): TValue | undefined {
		return this.valuesByName.get(NormalizedNameMap.normalizeName(name));
	}

	set(name: string, value: TValue): this {
		this.valuesByName.set(NormalizedNameMap.normalizeName(name), value);
		return this;
	}

	clone(): NormalizedNameMap<TValue> {
		const lookup = new NormalizedNameMap<TValue>();

		for (const [normalizedName, value] of this.valuesByName) {
			lookup.valuesByName.set(normalizedName, value);
		}

		return lookup;
	}
}
