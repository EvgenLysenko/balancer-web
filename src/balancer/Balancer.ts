import { IDriveState } from "./BalancerParser";

export interface IDisbalance {
    angle: number;
    value: number;
}

export class Disbalance implements IDisbalance {
    angle: number = 0;
    value: number = 0;
}

export interface IDisbalanceVector {
    x: number;
    y: number;
}

export class DisbalanceVector implements IDisbalanceVector {
    x: number = 0;
    y: number = 0;
}

export enum BalancerRotationStartState {
    Zero = "ZERO",
    Left = "LEFT",
    Right = "RIGHT",
    Common = "",
    Current = "CURRENT",
}

export interface IBalanceStep {
    left: IDisbalance;
    right: IDisbalance;
    lVector: IDisbalanceVector;
    rVector: IDisbalanceVector;
}

export class BalanceStep {
    constructor(step?: IBalanceStep) {
        if (step) {
            this.left.angle = step.left.angle;
            this.left.value = step.left.value;
            this.right.angle = step.right.angle;
            this.right.value = step.right.value;
            this.lVector.x = step.lVector.x;
            this.lVector.y = step.lVector.y;
            this.rVector.x = step.rVector.x;
            this.rVector.y = step.rVector.y;
        }
    }

    readonly left: IDisbalance = new Disbalance();
    readonly right: IDisbalance = new Disbalance();
    readonly lVector: IDisbalanceVector = new DisbalanceVector();
    readonly rVector: IDisbalanceVector = new DisbalanceVector();
}

export class Balancer
{
    //public disbalance: IDisbalance = { angle: 0, value: 0 };
    //public disbalanceZero: IDisbalance = { angle: 0, value: 0 };
    //public disbalanceLeft: IDisbalance = { angle: 0, value: 0 };
    //public disbalanceRight: IDisbalance = { angle: 0, value: 0 };
    protected disbalanceChangeTime: number = 0;
    public get getDisbalanceChangeTime(): number { return this.disbalanceChangeTime; }

    public step0: BalanceStep = new BalanceStep();
    public step1: BalanceStep = new BalanceStep();
    public step2: BalanceStep = new BalanceStep();
    public stepCalibration: BalanceStep = new BalanceStep();
    public stepCurrent: BalanceStep = new BalanceStep();

    public static idxToStep(idx: number): BalancerRotationStartState {
        switch (idx) {
        case 0: return BalancerRotationStartState.Zero;
        case 1: return BalancerRotationStartState.Left;
        case 2: return BalancerRotationStartState.Right;
        case 3: return BalancerRotationStartState.Common;
        default:
            return BalancerRotationStartState.Current;
        }
    }

    public static isSame(state1: IDriveState, state2: IDriveState): boolean {
        return state1.isIdle === state2.isIdle &&
            state1.angle === state2.angle &&
            state1.rpm === state2.rpm;
    }

    public static isDisbalanceSame(disbalance: IDisbalance, angle: number, value: number): boolean {
        return disbalance.angle === angle && disbalance.value === value;
    }

    public static isVectorSame(vector1: IDisbalanceVector, vector2: IDisbalanceVector): boolean {
        return vector1.x === vector2.x && vector1.y === vector2.y;
    }

    public static isStepSame(step: BalanceStep, left: IDisbalance, right: IDisbalance, lVector: IDisbalanceVector, rVector: IDisbalanceVector): boolean {
        return Balancer.isDisbalanceSame(step.left, left.angle, left.value) &&
            Balancer.isDisbalanceSame(step.right, right.angle, right.value) &&
            Balancer.isVectorSame(step.lVector, lVector) &&
            Balancer.isVectorSame(step.rVector, rVector);
    }

    public static isStepsSame(step1: BalanceStep, step2: BalanceStep): boolean {
        return Balancer.isDisbalanceSame(step1.left, step2.left.angle, step2.left.value) &&
            Balancer.isDisbalanceSame(step1.right, step2.right.angle, step2.right.value) &&
            Balancer.isVectorSame(step1.lVector, step2.lVector) &&
            Balancer.isVectorSame(step1.rVector, step2.rVector);
    }

    public disbalanceUpdateIfChanged(disbalance: IDisbalance, angle: number, value: number): boolean {
        if (!Balancer.isDisbalanceSame(disbalance, angle, value)) {
            disbalance.angle = angle;
            disbalance.value = value;
            this.disbalanceChangeTime = Date.now();
            return true;
        }
        else
            return false;
    }

    public updateStepIfChanged(step: BalanceStep, left: IDisbalance, right: IDisbalance, lVector: IDisbalanceVector, rVector: IDisbalanceVector): boolean {
        if (!Balancer.isStepSame(step, left, right, lVector, rVector)) {
            step.left.angle = left.angle;
            step.left.value = left.value;
            step.right.angle = right.angle;
            step.right.value = right.value;

            step.lVector.x = lVector.x;
            step.lVector.y = lVector.y;
            step.rVector.x = rVector.x;
            step.rVector.y = rVector.y;

            this.disbalanceChangeTime = Date.now();

            return true;
        }
        else
            return false;
    }

    // public disbalanceUpdate(stage: BalancerRotationStartState, angle: number, value: number): boolean {
    //     switch (stage) {
    //     case BalancerRotationStartState.Zero:
    //         return this.disbalanceUpdateIfChanged(this.disbalanceZero, angle, value);
    //     case BalancerRotationStartState.Left:
    //         return this.disbalanceUpdateIfChanged(this.disbalanceLeft, angle, value);
    //     case BalancerRotationStartState.Right:
    //         return this.disbalanceUpdateIfChanged(this.disbalanceRight, angle, value);
    //     case BalancerRotationStartState.Common:
    //         return this.disbalanceUpdateIfChanged(this.disbalance, angle, value);
    //     }

    //     return false;
    // }

    public updateStep(stage: BalancerRotationStartState, left: IDisbalance, right: IDisbalance, lVector: IDisbalanceVector, rVector: IDisbalanceVector): boolean {
        switch (stage) {
        case BalancerRotationStartState.Zero:
            return this.updateStepIfChanged(this.step0, left, right, lVector, rVector);
        case BalancerRotationStartState.Left:
            return this.updateStepIfChanged(this.step1, left, right, lVector, rVector);
        case BalancerRotationStartState.Right:
            return this.updateStepIfChanged(this.step2, left, right, lVector, rVector);
        case BalancerRotationStartState.Common:
            return this.updateStepIfChanged(this.stepCalibration, left, right, lVector, rVector);
        case BalancerRotationStartState.Current:
            return this.updateStepIfChanged(this.stepCurrent, left, right, lVector, rVector);
        }

        return false;
    }
}
