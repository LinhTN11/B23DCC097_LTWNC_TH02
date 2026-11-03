export type Reducer<S, A> = (state: S, action: A) => S;

export function withLogger<S, A extends { type: string }>(
  reducer: Reducer<S, A>,
): Reducer<S, A> {
  return (prevState: S, action: A): S => {
    const nextState = reducer(prevState, action);
    if (import.meta.env.DEV) {
      console.log(action.type, prevState, nextState);
    }
    return nextState;
  };
}
