import { Button, Input } from "antd";
import React, { useState } from "react";
import { io } from "socket.io-client";

const PrinterSelection = () => {
	const [printText, setPrintText] = useState("");

	// Fungsi untuk mengirim data ke printer thermal melalui WebSocket
	const printToPrinter = () => {
		const text = "Teks yang ingin dicetak";
		const asciiText = text.replace(/[^\x00-\x7F]/g, ""); // Hapus karakter non-ASCII
		const encoder = new TextEncoder();
		const encodedText = encoder.encode(asciiText);

		const socket = io("ws://192.168.99.43:9100"); // Ganti dengan alamat IP dan port printer thermal Anda
		socket.emit("print", { text: encodedText });

		// Tanggapi hasil pencetakan dari printer
		socket.on("printResult", (result) => {
			console.log("Hasil pencetakan:", result);
			// Tambahkan logika untuk menampilkan pesan sukses atau gagal kepada pengguna
		});

		socket.disconnect();
	};

	return (
		<div>
			<Input
				label="Teks untuk dicetak"
				value={printText}
				onChange={(e) => setPrintText(e.target.value)}
			/>
			<Button
				variant="contained"
				color="primary"
				onClick={printToPrinter}
			>
				Cetak
			</Button>
		</div>
	);
};

export default PrinterSelection;
