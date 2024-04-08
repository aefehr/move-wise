import pandas as pd
import json
from tkinter import Tk, filedialog
from tqdm import tqdm


def select_file():
    root = Tk()
    root.withdraw()  # Hide the root window
    file_path = filedialog.askopenfilename()  # Open file dialog to select the CSV
    return file_path


def process_real_estate_data(file_path):
    target_status = "for_sale"
    chunk_size = 50000  # Adjust chunk size to your preference

    total_rows_before = 0
    total_rows_after = 0
    list_of_chunks = []  # List to store the filtered chunks
    unique_id = 0  # Initialize a counter for unique id

    # Progress bar setup
    tqdm.pandas(desc="Processing")

    # Reading the file in chunks
    for chunk in pd.read_csv(file_path, chunksize=chunk_size):
        # Count the total rows before filtering
        total_rows_before += len(chunk)

        # Filter the chunk
        filtered_chunk = chunk[
            (chunk["status"] == target_status)
            & ~(chunk[["bed", "bath", "acre_lot", "house_size"]].isnull().all(axis=1))
        ]

        # Add an 'id' column as a unique identifier
        filtered_chunk["id"] = range(unique_id, unique_id + len(filtered_chunk))
        unique_id += len(filtered_chunk)  # Update the counter for the next chunk

        # Count the total rows after filtering
        total_rows_after += len(filtered_chunk)

        # Append the filtered chunk to the list
        list_of_chunks.append(filtered_chunk)

    # Concatenate all the filtered chunks into one DataFrame
    filtered_data = pd.concat(list_of_chunks, ignore_index=True)

    # Construct the output file names
    output_csv_file_name = file_path.rsplit(".", 1)[0] + "_filtered.csv"
    output_stats_file_name = file_path.rsplit(".", 1)[0] + "_stats.json"

    # Save the filtered DataFrame to a new CSV file
    filtered_data.to_csv(output_csv_file_name, index=False)

    # Statistics
    stats = {
        "total_rows_before": total_rows_before,
        "total_rows_after": total_rows_after,
        "column_names": filtered_data.columns.tolist(),
        "nan_counts_per_column": filtered_data.isna().sum().to_dict(),
    }

    # Save the statistics to a JSON file
    with open(output_stats_file_name, "w") as stats_file:
        json.dump(stats, stats_file, indent=4)

    print(f"Filtered data saved to {output_csv_file_name}")
    print(f"Statistics saved to {output_stats_file_name}")


if __name__ == "__main__":
    file_path = select_file()
    if file_path:
        process_real_estate_data(file_path)
    else:
        print("No file selected. Please run the script again and select a file.")
