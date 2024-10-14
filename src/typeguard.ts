export function isTouchEvent(e: any): e is TouchEvent {
  return "touches" in e;
}

export function isMouseEvent(e: any): e is MouseEvent {
  return "clientY" in e && e.ctrlKey !== undefined;
}
export function isPointerEvent(e: any): e is PointerEvent {
  return "clientY" in e && e.ctrlKey === undefined;
}
