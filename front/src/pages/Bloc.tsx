import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const Bloc: React.FC = () => {
    const params = useParams();

    return <div>{params.id}</div>
};
