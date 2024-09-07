import { toast } from "sonner";

export function notify(text) {
	return toast.success(text, {
		style: {
			background: "white",
			color: "green", // White
			paddingLeft: 6,
			paddingRight: 6,
			paddingBottom: 4,
			paddingTop: 4,
			border: 0,
			borderRadius: 50,
		},
	});
}
export function notifyError(text) {
	return toast.error(text, {
		style: {
			background: "white",
			color: "red", // White
			paddingLeft: 6,
			paddingRight: 6,
			paddingBottom: 4,
			paddingTop: 4,
			border: 0,
			borderRadius: 50,
		},
	});
}
