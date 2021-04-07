import React from "react";
import { AbstractTooltipProps } from "antd/lib/tooltip";
import { Tooltip } from "antd";

import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

import { BaseFieldProps } from "../../../interfaces/field";

import { renderFieldRecord } from "@definitions";

export type BooleanFieldProps = BaseFieldProps &
    AbstractTooltipProps & {
        valueLabelTrue?: string;
        valueLabelFalse?: string;
        trueIcon?: React.FC | object;
        falseIcon?: React.FC | object;
    };

export const BooleanField: React.FC<BooleanFieldProps> = ({
    value,
    record,
    renderRecordKey,
    valueLabelTrue = "true",
    valueLabelFalse = "false",
    trueIcon = <CheckOutlined />,
    falseIcon = <CloseOutlined />,
    ...rest
}) => {
    const recordValue = Boolean(
        renderFieldRecord({ value, record, renderRecordKey }),
    );

    return (
        <Tooltip
            title={recordValue ? valueLabelTrue : valueLabelFalse}
            {...rest}
        >
            {recordValue ? <span>{trueIcon}</span> : <span>{falseIcon}</span>}
        </Tooltip>
    );
};