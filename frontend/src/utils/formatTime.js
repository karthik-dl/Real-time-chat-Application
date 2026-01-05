// export const formatTime = (date) => {
//   return new Date(date).toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit"
//   });
// };


export const formatTime = (date) => {
  if (!date) return "";

  const d = new Date(date);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
