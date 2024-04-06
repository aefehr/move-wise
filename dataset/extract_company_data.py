import pandas as pd
import json
from tkinter import Tk, filedialog
from tqdm import tqdm
from pathlib import Path


def select_file():
    root = Tk()
    root.withdraw()
    file_path = filedialog.askopenfilename()
    return file_path


def extract_us_rows(file_path):
    us_spellings = [
        "United States",
        "USA",
        "US",
        "United States of America",
        "U.S.",
        "U.S.A.",
        "America",
        "united states",
    ]

    chunk_size = 50000  # Adjust based on your memory capacity and file size
    list_of_chunks = []  # List to store chunks after processing
    total_rows_before = 0

    # Correctly get the file size for progress reporting
    total_size = Path(file_path).stat().st_size
    processed_size = 0

    # Initialize a tqdm progress bar
    pbar = tqdm(total=total_size, unit="B", unit_scale=True, desc="Processing")

    # Process the CSV in chunks
    for chunk in pd.read_csv(
        file_path, chunksize=chunk_size, error_bad_lines=False, warn_bad_lines=False
    ):
        # Ensure the 'country' column is a string to avoid AttributeError for NaN values
        chunk["country"] = chunk["country"].astype(str)

        # Normalize the 'country' column for case-insensitive comparison and trim whitespace
        normalized_country = chunk["country"].str.lower().str.strip()

        # Filter chunk for rows where the normalized 'country' matches any of the specified spellings
        filtered_chunk = chunk[normalized_country.isin(us_spellings)]
        list_of_chunks.append(filtered_chunk)
        total_rows_before += len(chunk)

        # Update the tqdm progress bar
        processed_size += chunk.memory_usage(deep=True).sum()  # Estimate processed size
        pbar.update(processed_size - pbar.n)  # Update progress bar with the chunk size

    pbar.close()  # Close the progress bar

    # Concatenate all processed chunks
    us_data = pd.concat(list_of_chunks, ignore_index=True)

    base_file_name = Path(file_path).stem
    output_csv_file_name = f"{base_file_name}_us_extracted.csv"
    output_json_file_name = f"{base_file_name}_us_extracted_stats.json"

    # Save the filtered DataFrame to a new .csv file, ensuring it's a valid CSV
    us_data.to_csv(output_csv_file_name, index=False)

    # Create and save the statistics JSON file
    stats = {
        "total_rows_before_extraction": total_rows_before,
        "total_rows_after_extraction": len(us_data),
        "column_names": us_data.columns.tolist(),
        "nan_counts_per_column": us_data.isna().sum().to_dict(),
    }

    with open(output_json_file_name, "w") as json_file:
        json.dump(stats, json_file, indent=4)

    print(f"Data extracted to {output_csv_file_name}")
    print(f"Statistics saved to {output_json_file_name}")


if __name__ == "__main__":
    file_path_str = select_file()
    if file_path_str:
        extract_us_rows(file_path_str)
    else:
        print("No file selected.")
