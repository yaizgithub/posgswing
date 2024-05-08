import { Button } from 'antd';
import React from 'react'

const PrintComponent = ({ printerURL }) => {
  const printWithSelectedPrinter = () => {
    const style = `
      @media print {
        @page {
          size: 80mm 80mm; /* Ukuran kertas printer thermal */
          margin: 0;
        }
        body {
          margin: initial;
          font-family: Arial, sans-serif;
        }
      }
    `;

    const printerStyle = document.createElement('style');
    printerStyle.textContent = style;
    document.head.appendChild(printerStyle);

    const ws = new WebSocket(printerURL);
    ws.onopen = () => {
      ws.send('Hello, world!\n'); // Kirim perintah cetak ke printer melalui WebSocket
      ws.close(); // Tutup koneksi setelah selesai mencetak
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  return (
    <div>
      <button onClick={printWithSelectedPrinter}>Cetak Struk</button>
    </div>
  );
};

export default PrintComponent



// import React from 'react';
// import  useWebSocket  from 'react-use-websocket';

// const PrinterComponent = () => {
//   const printerURL = 'ws://192.168.99.42:9100';
  

//   // Tangani event onOpen, onClose, onError
// //   const { sendJsonMessage, readyState, lastJsonMessage, sendMessage, lastMessage, isError, reconnect } = useWebSocket(printerURL, {
// //     onError: (event) => {
// //       console.error('WebSocket error:', event);
// //     }
// //   });

// const { sendMessage, sendJsonMessage, readyState } = useWebSocket(
//     printerURL,
//     {
//         share: true,
//         shouldReconnect: () => true,
//         reconnectAttempts: 3,
//         reconnectInterval: 3000,
//         onError: (event) => {
//             alert.show('WebSocket trying to connect to sever but failed!', {
//                 type: 'error',
//                 position: 'bottom right',
//                 timeout: 3000
//             })
//         },
//         onOpen: (event) => {
//             alert.show('WebSocket connection establised!', {
//                 type: 'success',
//                 position: 'bottom right',
//                 timeout: 3000
//             })
//         },
//         onClose: (event) => {
//             alert.show('WebSocket connection is closed!', {
//                 type: 'warning',
//                 position: 'bottom right',
//                 timeout: 3000
//             })
//         },
//         onReconnectStop: () => 6
//     }
// )

  
  

//   // Ketika koneksi terbuka, kirim perintah cetak ke printer thermal
//   const handlePrint = () => {
//     console.log('test print');
//     console.log('WebSocket ready state:', readyState);
  
//     if (readyState === 0) {
//       // Kirim perintah cetak dalam format yang sesuai dengan protokol printer thermal
//       const printCommand = 'Hello, world!\n';
//       sendJsonMessage(printCommand);
//       console.log("Hallo");
//     }
//   };

//   return (
//     <div>
//       <button onClick={handlePrint}>Cetak Struk</button>
//     </div>
//   );
// };

// export default PrinterComponent;




// import React from 'react';
// import { render, Printer, Text } from 'react-thermal-printer';

// class PrintComponent extends React.Component {
//   handlePrint = async () => {
//     const printerIP = '192.168.1.100'; // Ganti dengan alamat IP printer thermal Anda
//     const printerPort = 9100; // Port standar untuk printer thermal

//     try {
//       const data = await render(
//         <Printer type="network" host={printerIP} port={printerPort}>
//           <Text text="Hello, world!" setTextNormal /> {/* Mengatur teks ke mode normal */}
//         </Printer>
//       );
      
//       console.log(data); // Data yang akan dicetak
      
//       // Selanjutnya, Anda dapat mengirim data ke printer menggunakan koneksi TCP/IP
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   render() {
//     return (
//       <div>
//         <button onClick={this.handlePrint}>Cetak Struk</button>
//       </div>
//     );
//   }
// }

// export default PrintComponent;