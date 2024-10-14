export function isTouchEvent(e: any): e is TouchEvent {
  return "touches" in e;
}

export function isPointerEvent(e: any): e is PointerEvent {
  return "clientY" in e;
}
