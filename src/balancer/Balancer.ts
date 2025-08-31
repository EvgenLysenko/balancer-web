import { IDriveState } from "./BalancerParser";

export interface IDisbalance {
    angle: number;
    value: number;
}

export enum BalancerRotationStartState {
    Zero = "ZERO",
    Left = "LEFT",
    Right = "RIGHT",
    Common = "",
}

export class Balancer
{
    public disbalance: IDisbalance = { angle: 0, value: 0 };
    public disbalanceZero: IDisbalance = { angle: 0, value: 0 };
    public disbalanceLeft: IDisbalance = { angle: 0, value: 0 };
    public disbalanceRight: IDisbalance = { angle: 0, value: 0 };
    protected disbalenceChangeTime: number = 0;
    public get getDisbalenceChangeTime(): number { return this.disbalenceChangeTime; }

    public static isSame(state1: IDriveState, state2: IDriveState): boolean {
        return state1.isIdle === state2.isIdle &&
            state1.angle === state2.angle &&
            state1.rpm === state2.rpm;
    }

    public static isDisbalanceSame(disbalance: IDisbalance, angle: number, value: number): boolean {
        return disbalance.angle === angle && disbalance.value === value;
    }

    public disbalanceUpdateIfChanged(disbalance: IDisbalance, angle: number, value: number): boolean {
        if (!Balancer.isDisbalanceSame(disbalance, angle, value)) {
            disbalance.angle = angle;
            disbalance.value = value;
            this.disbalenceChangeTime = Date.now();
            return true;
        }
        else
            return false;
    }

    public disbalanceUpdate(stage: BalancerRotationStartState, angle: number, value: number): boolean {
        switch (stage) {
        case BalancerRotationStartState.Zero:
            return this.disbalanceUpdateIfChanged(this.disbalanceZero, angle, value);
        case BalancerRotationStartState.Left:
            return this.disbalanceUpdateIfChanged(this.disbalanceLeft, angle, value);
        case BalancerRotationStartState.Right:
            return this.disbalanceUpdateIfChanged(this.disbalanceRight, angle, value);
        case BalancerRotationStartState.Common:
            return this.disbalanceUpdateIfChanged(this.disbalance, angle, value);
        }

        return false;
    }
}
