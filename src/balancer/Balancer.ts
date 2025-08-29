import { IDriveState } from "./BalancerParser";

export class Balancer
{
    public static isSame(state1: IDriveState, state2: IDriveState): boolean {
        return state1.isIdle === state2.isIdle &&
            state1.angle === state2.angle &&
            state1.rpm === state2.rpm;
    }
}
