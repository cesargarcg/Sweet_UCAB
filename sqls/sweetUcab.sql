CREATE TABLE Lugar (
	L_ID		SERIAL,
	L_Tipo		VARCHAR(20)		NOT NULL,
	L_Nombre	VARCHAR(20)		NOT NULL,
	FK_L_ID		SERIAL,
	CONSTRAINT PK_Lugar PRIMARY KEY (L_ID),
	CONSTRAINT se_localiza FOREIGN KEY (FK_L_ID) REFERENCES Lugar (L_ID),
	CONSTRAINT check_Lugar CHECK (L_Tipo IN('Estado', 'Municipio', 'Parroquia'))
);

CREATE TABLE Tienda (
	TI_ID		NUMERIC(10),
	TI_Nombre	VARCHAR(20)		NOT NULL,
	TI_Tipo		VARCHAR(15)		NOT NULL,
	FK_L_ID		SERIAL			NOT NULL,
	CONSTRAINT PK_Tienda PRIMARY KEY (TI_ID),
	CONSTRAINT ubica FOREIGN KEY (FK_L_ID) REFERENCES Lugar (L_ID),
	CONSTRAINT check_Tienda CHECK(TI_Tipo IN('SweetShop','Mini SweetShop'))
);

CREATE TABLE Almacen (
	AL_ID		SERIAL,
	AL_Nombre	VARCHAR(20)		NOT NULL,
	FK_TI_ID	NUMERIC(10)		NOT NULL,
	CONSTRAINT PK_Almacen PRIMARY KEY (AL_ID),
	CONSTRAINT comprende FOREIGN KEY (FK_TI_ID) REFERENCES Tienda (TI_ID)
);

CREATE TABLE Rubro (
	R_ID			SERIAL,
	R_Nombre		VARCHAR(20)		NOT NULL,
	R_Descripcion	VARCHAR(250)	NOT NULL,
	CONSTRAINT PK_Rubro PRIMARY KEY (R_ID)
);

CREATE TABLE Zona_Almacen (
	ZAL_ID				SERIAL,
	ZAL_Nombre			VARCHAR(20)		NOT NULL,
	ZAL_Cantidad_Disp	NUMERIC(7)		NOT NULL,
	FK_AL_ID			SERIAL			NOT NULL,
	FK_R_ID				SERIAL			NOT NULL,
	CONSTRAINT PK_Zona_Almacen PRIMARY KEY (ZAL_ID,FK_AL_ID),
	CONSTRAINT se_compone FOREIGN KEY (FK_AL_ID) REFERENCES Almacen (AL_ID),
	CONSTRAINT se_almacena FOREIGN KEY (FK_R_ID) REFERENCES Rubro (R_ID)
);

CREATE TABLE Pasillo (
	PA_ID			SERIAL,
	PA_Numero		NUMERIC(10)		NOT NULL,
	FK_TI_ID		NUMERIC(10)		NOT NULL,
	CONSTRAINT PK_Pasillo PRIMARY KEY (PA_ID),
	CONSTRAINT cuenta_con FOREIGN KEY (FK_TI_ID) REFERENCES Tienda (TI_ID)
);

CREATE TABLE Zona_Pasillo (
	ZP_ID				SERIAL,
	ZP_Nombre			VARCHAR(20)		NOT NULL,	
	ZP_Cantidad_Disp	NUMERIC(7)		NOT NULL,
	FK_PA_ID			SERIAL			NOT NULL,
	FK_R_ID				SERIAL			NOT NULL,
	CONSTRAINT PK_Zona_Pasillo PRIMARY KEY (ZP_ID, FK_PA_ID),
	CONSTRAINT se_constituye FOREIGN KEY (FK_PA_ID) REFERENCES Pasillo (PA_ID),
	CONSTRAINT se_conserva FOREIGN KEY (FK_R_ID) REFERENCES Rubro (R_ID)
);

CREATE TABLE Sabor (
	S_ID			SERIAL,
	S_Nombre		VARCHAR(20)		NOT NULL,
	S_Descripcion		VARCHAR(250)		NOT NULL,
	CONSTRAINT PK_Sabor PRIMARY KEY (S_ID)
);

CREATE TABLE Color (
	C_ID			SERIAL,
	C_Nombre		VARCHAR(20)		NOT NULL,
	CONSTRAINT PK_Color PRIMARY KEY (C_ID)
);

CREATE TABLE Tamano (
	T_ID			SERIAL,
	T_Valor			NUMERIC(5)		NOT NULL,
	CONSTRAINT PK_Tamano PRIMARY KEY (T_ID)
);

CREATE TABLE Forma (
	F_ID			SERIAL,
	F_Nombre		VARCHAR(20)		NOT NULL,
	CONSTRAINT PK_Forma PRIMARY KEY (F_ID)
);

CREATE TABLE Producto (
	P_ID			SERIAL,
	P_Nombre		VARCHAR(20)		NOT NULL,
	P_Descripcion	VARCHAR(250)	NOT NULL,
	P_Peso			NUMERIC(10)		NOT NULL,
	FK_R_ID			SERIAL			NOT NULL,
	FK_T_ID			SERIAL			NOT NULL,
	FK_F_ID			SERIAL			NOT NULL,
	FK_ZP_ID		SERIAL			NOT NULL,
	FK_PA_ID		SERIAL			NOT NULL,
	FK_ZAL_ID		SERIAL			NOT NULL,
	FK_AL_ID		SERIAL			NOT NULL,
	CONSTRAINT PK_Producto PRIMARY KEY (P_ID),
	CONSTRAINT pertenece FOREIGN KEY (FK_R_ID) REFERENCES Rubro (R_ID),
	CONSTRAINT mide FOREIGN KEY (FK_T_ID) REFERENCES Tamano (T_ID),
	CONSTRAINT apariencia FOREIGN KEY (FK_F_ID) REFERENCES Forma (F_ID),
	CONSTRAINT conserva FOREIGN KEY (FK_ZP_ID, FK_PA_ID) REFERENCES Zona_Pasillo (ZP_ID, FK_PA_ID),
	CONSTRAINT almacena FOREIGN KEY (FK_ZAL_ID, FK_AL_ID) REFERENCES Zona_Almacen (ZAL_ID, FK_AL_ID)
);

CREATE TABLE Producto_Color (
	FK_C_ID		SERIAL,
	FK_P_ID		SERIAL,
	CONSTRAINT PK_Producto_Color PRIMARY KEY (FK_C_ID, FK_P_ID),
	CONSTRAINT vinculado FOREIGN KEY (FK_C_ID) REFERENCES Color (C_ID),
	CONSTRAINT se_ve FOREIGN KEY (FK_P_ID) REFERENCES Producto (P_ID)
);

CREATE TABLE Producto_Sabor (
	FK_S_ID		SERIAL,
	FK_P_ID		SERIAL,
	CONSTRAINT PK_Producto_Sabor PRIMARY KEY (FK_S_ID, FK_P_ID),
	CONSTRAINT relacionado FOREIGN KEY (FK_S_ID) REFERENCES Sabor (S_ID),
	CONSTRAINT sabe FOREIGN KEY (FK_P_ID) REFERENCES Producto (P_ID)
);

CREATE TABLE Inventario (
	FK_P_ID		SERIAL,
	FK_TI_ID	NUMERIC(10),
	I_Cantidad	NUMERIC(7)		NOT NULL,
	CONSTRAINT PK_Inventario PRIMARY KEY (FK_P_ID, FK_TI_ID),
	CONSTRAINT se_guarda FOREIGN KEY (FK_P_ID) REFERENCES Producto (P_ID),
	CONSTRAINT guarda FOREIGN KEY (FK_TI_ID) REFERENCES Tienda (TI_ID)
);

CREATE TABLE Pedido_Fabrica (
	PF_ID			SERIAL,
	FK_TI_ID		NUMERIC(10),
	PF_Cantidad		NUMERIC(5)		NOT NULL,
	PF_Numero_Orden	NUMERIC(10)		NOT NULL,
	PF_Fecha		DATE			NOT NULL,
	CONSTRAINT PK_Pedido_Fabrica PRIMARY KEY (PF_ID, FK_TI_ID),
	CONSTRAINT adquiere FOREIGN KEY (FK_TI_ID) REFERENCES Tienda (TI_ID)
);

CREATE TABLE SweetFlyer (
	SF_ID			SERIAL,
	SF_Fecha_Fin	DATE			NOT NULL,
	SF_Descripcion	VARCHAR(250)	NOT NULL,
	CONSTRAINT PK_SweetFlyer PRIMARY KEY (SF_ID)
);

CREATE TABLE Producto_Revista (
	FK_P_ID				SERIAL,
	FK_SF_ID			SERIAL,
	P_R_Precio_Oferta	NUMERIC(7)		NOT NULL,
	CONSTRAINT PK_Producto_Revista PRIMARY KEY (FK_P_ID, FK_SF_ID),
	CONSTRAINT se_oferta FOREIGN KEY (FK_P_ID) REFERENCES Producto (P_ID),
	CONSTRAINT contiene FOREIGN KEY (FK_SF_ID) REFERENCES SweetFlyer (SF_ID)
);

CREATE TABLE Cliente_Natural (
	CN_ID				SERIAL,
	CN_RIF				NUMERIC(10)		NOT NULL	UNIQUE,
	CN_CI				NUMERIC(10)		NOT NULL	UNIQUE,
	CN_Prim_Nom			VARCHAR(20)		NOT NULL,
	CN_Seg_Nom			VARCHAR(20),
	CN_Prim_Ap			VARCHAR(20)		NOT NULL,
	CN_Seg_Ap			VARCHAR(25),
	CN_Correo			VARCHAR(30)		NOT NULL,
	CN_Codigo_Tienda	NUMERIC(10),
	FK_L_ID				SERIAL			NOT NULL,
	CONSTRAINT PK_Cliente_Natural PRIMARY KEY (CN_ID),
	CONSTRAINT direccion FOREIGN KEY (FK_L_ID) REFERENCES Lugar (L_ID)
);

CREATE TABLE Cliente_Juridico (
	CJ_ID				SERIAL,
	CJ_RIF				NUMERIC(10)		NOT NULL	UNIQUE,
	CJ_Den_Com			VARCHAR(30)		NOT NULL,
	CJ_Raz_Soc			VARCHAR(30)		NOT NULL,
	CJ_Pag_Web			VARCHAR(100)	NOT NULL,
	CJ_Capital			NUMERIC(10)		NOT NULL,
	CJ_Codigo_Tienda	NUMERIC(10),
	FK_L_ID				SERIAL			NOT NULL,
	FK_L_ID_2			SERIAL			NOT NULL,
	CONSTRAINT PK_Cliente_Juridico PRIMARY KEY (CJ_ID),
	CONSTRAINT direccion_fiscal FOREIGN KEY (FK_L_ID) REFERENCES Lugar (L_ID),
	CONSTRAINT direccion_principal FOREIGN KEY (FK_L_ID_2) REFERENCES Lugar (L_ID)
);

CREATE TABLE Metodo_Pago (
	MP_ID				SERIAL,
	MP_Nombre			VARCHAR(20)		NOT NULL,
	MP_Tipo_Tarjeta		VARCHAR(7),
	MP_Numero_Tarjeta	NUMERIC(12),
	MP_Correo_Zelle		VARCHAR(25),
	MP_Banco_PagoMovil	VARCHAR(20),
	MP_Correo_Paypal	VARCHAR(25),
	MP_Nombre_Paypal	VARCHAR(20),
	MP_Tipo_Efectivo	VARCHAR(10),
	MP_Cantidad_Puntos	NUMERIC(10),
	MP_Tipo				VARCHAR(20),
	FK_CN_ID			SERIAL,
	FK_CJ_ID			SERIAL,
	CONSTRAINT PK_Metodo_Pago PRIMARY KEY (MP_ID),
	CONSTRAINT utiliza FOREIGN KEY (FK_CN_ID) REFERENCES Cliente_Natural (CN_ID),
	CONSTRAINT emplea FOREIGN KEY (FK_CJ_ID) REFERENCES Cliente_Juridico (CJ_ID),
	CONSTRAINT check_MP_Tipo_Tarjeta CHECK (MP_Tipo_Tarjeta IN ('Credito', 'Debito')),
	CONSTRAINT check_MP_Tipo_Efectivo CHECK (MP_Tipo_Efectivo IN ('Dolares', 'Bolivares')),
	CONSTRAINT check_MP_Tipo CHECK (MP_Tipo IN 
				('Tarjeta', 'Zelle', 'PagoMovil', 'Efectivo', 'Paypal', 'Puntos'))
);

CREATE TABLE Pedido_Online (
	PE_ID			SERIAL,
	PE_Numero_Orden	NUMERIC(10)		NOT NULL,
	PE_Fecha		DATE			NOT NULL,
	PE_Monto_Total	NUMERIC(10)		NOT NULL,
	FK_CN_ID		SERIAL,
	FK_CJ_ID		SERIAL,
	CONSTRAINT PK_Pedido_Online PRIMARY KEY (PE_ID),
	CONSTRAINT online_hace FOREIGN KEY (FK_CN_ID) REFERENCES Cliente_Natural (CN_ID),
	CONSTRAINT online_realiza FOREIGN KEY (FK_CJ_ID) REFERENCES Cliente_Juridico (CJ_ID)
);

CREATE TABLE Pedido_Fisico (
	PE_ID			SERIAL,
	PE_Numero_Orden	NUMERIC(10)		NOT NULL,
	PE_Fecha		DATE			NOT NULL,
	PE_Monto_Total	NUMERIC(10)		NOT NULL,
	FK_CN_ID		SERIAL,
	FK_CJ_ID		SERIAL,
	FK_TI_ID		NUMERIC(10)		NOT NULL,
	CONSTRAINT PK_Pedido_Fisico PRIMARY KEY (PE_ID),
	CONSTRAINT fisico_hace FOREIGN KEY (FK_CN_ID) REFERENCES Cliente_Natural (CN_ID),
	CONSTRAINT fisico_realiza FOREIGN KEY (FK_CJ_ID) REFERENCES Cliente_Juridico (CJ_ID),
	CONSTRAINT vende FOREIGN KEY (FK_TI_ID) REFERENCES Tienda (TI_ID)
);

CREATE TABLE MetodoPago_Online (
	FK_MP_ID		SERIAL,
	FK_PE_ID		SERIAL,
	MP_Monto_Cancelado	NUMERIC(10)		NOT NULL,
	CONSTRAINT PK_MetodoPago_Online PRIMARY KEY (FK_MP_ID, FK_PE_ID),
	CONSTRAINT online_pagado_con FOREIGN KEY (FK_PE_ID) REFERENCES Pedido_Online (PE_ID),
	CONSTRAINT online_se_uso FOREIGN KEY (FK_MP_ID) REFERENCES Metodo_Pago (MP_ID)
);

CREATE TABLE MetodoPago_Fisico (
	FK_MP_ID		SERIAL,
	FK_PE_ID		SERIAL,
	MP_Monto_Cancelado	NUMERIC(10)		NOT NULL,
	CONSTRAINT PK_MetodoPago_Fisico PRIMARY KEY (FK_MP_ID, FK_PE_ID),
	CONSTRAINT fisico_pagado_con FOREIGN KEY (FK_PE_ID) REFERENCES Pedido_Fisico (PE_ID),
	CONSTRAINT fisico_se_uso FOREIGN KEY (FK_MP_ID) REFERENCES Metodo_Pago (MP_ID)
);

CREATE TABLE Detalle_Pedido (
	DP_ID				NUMERIC(10),
	FK_P_ID				SERIAL,
	DP_Cantidad			NUMERIC(7)		NOT NULL,
	DP_Precio_Unitario	VARCHAR(7)		NOT NULL,
	FK_PE_Online_ID		SERIAL,
	FK_PE_Fisico_ID		SERIAL,
	FK_PF_ID			SERIAL,
	FK_TI_ID			NUMERIC(10),
	CONSTRAINT PK_Detalle_Pedido PRIMARY KEY (DP_ID, FK_P_ID),
	CONSTRAINT esta_presente FOREIGN KEY (FK_P_ID) REFERENCES Producto (P_ID),
	CONSTRAINT sostiene_online FOREIGN KEY (FK_PE_Online_ID) REFERENCES Pedido_Online (PE_ID),
	CONSTRAINT sostiene_fisico FOREIGN KEY (FK_PE_Fisico_ID) REFERENCES Pedido_Fisico (PE_ID),
	CONSTRAINT tiene FOREIGN KEY (FK_PF_ID, FK_TI_ID) REFERENCES Pedido_Fabrica (PF_ID, FK_TI_ID)
);

CREATE TABLE Estatus (
	ES_Clave		SERIAL,
	ES_Nombre		VARCHAR(25)		NOT NULL,
	ES_Descripcion	VARCHAR(250)	NOT NULL,
	CONSTRAINT PK_Estatus PRIMARY KEY (ES_Clave)
);

CREATE TABLE Estatus_Pedido_Online (
	ES_PE_ID		SERIAL,
	FK_PE_ID		SERIAL			NOT NULL,
	FK_ES_Clave		SERIAL			NOT NULL,
	ES_PE_Fecha		DATE			NOT NULL,
	CONSTRAINT PK_Estatus_Pedido_Online PRIMARY KEY (ES_PE_ID),
	CONSTRAINT se_halla FOREIGN KEY (FK_PE_ID) REFERENCES Pedido_Online (PE_ID),
	CONSTRAINT informa FOREIGN KEY (FK_ES_Clave) REFERENCES Estatus (ES_Clave)
);

CREATE TABLE Estatus_Pedido_Fisico (
	ES_PE_ID		SERIAL,
	FK_PE_ID		SERIAL			NOT NULL,
	FK_ES_Clave		SERIAL			NOT NULL,
	ES_PE_Fecha		DATE			NOT NULL,
	CONSTRAINT PK_Estatus_Pedido_Fisico PRIMARY KEY (ES_PE_ID),
	CONSTRAINT se_encuentra FOREIGN KEY (FK_PE_ID) REFERENCES Pedido_Fisico (PE_ID),
	CONSTRAINT anuncia FOREIGN KEY (FK_ES_Clave) REFERENCES Estatus (ES_Clave)
);

CREATE TABLE Estatus_Pedido_Fabrica (
	ES_PF_ID		SERIAL,
	FK_TI_ID        NUMERIC(10)     NOT NULL,
	FK_PF_ID		SERIAL			NOT NULL,
	FK_ES_Clave		SERIAL			NOT NULL,
	ES_PE_Fecha		DATE			NOT NULL,
	CONSTRAINT PK_Estatus_Pedido_Fabrica PRIMARY KEY (ES_PF_ID),
	CONSTRAINT se_ubica FOREIGN KEY (FK_PF_ID, FK_TI_ID) REFERENCES Pedido_Fabrica (PF_ID, FK_TI_ID),
	CONSTRAINT participa FOREIGN KEY (FK_ES_Clave) REFERENCES Estatus (ES_Clave)
);

CREATE TABLE Empleado (
	E_Clave			SERIAL,
	E_Nombre		VARCHAR(20)		NOT NULL,
	E_Apellido		VARCHAR(20)		NOT NULL,
	E_CI			NUMERIC(10)		NOT NULL	UNIQUE,
	E_Salario		NUMERIC(7)		NOT NULL,
	FK_TI_ID		NUMERIC(10),
	CONSTRAINT PK_Empleado PRIMARY KEY (E_Clave, FK_TI_ID),
	CONSTRAINT laboran FOREIGN KEY (FK_TI_ID) REFERENCES Tienda (TI_ID)
);

CREATE TABLE Horario (
	H_Clave			SERIAL,
	H_Hora_Inicio	TIME			NOT NULL,
	H_Hora_Fin		TIME			NOT NULL,
	H_Dia			VARCHAR(20)		NOT NULL,
	CONSTRAINT PK_Horario PRIMARY KEY (H_Clave),
	CONSTRAINT check_Horario CHECK (H_Dia IN ('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'))
);

CREATE TABLE Horario_Empleado (
	FK_E_Clave		SERIAL,
	FK_H_Clave		SERIAL,
	FK_TI_ID		NUMERIC(10),
	CONSTRAINT PK_Horario_Empleado PRIMARY KEY (FK_E_Clave, FK_H_Clave, FK_TI_ID),
	CONSTRAINT cumple FOREIGN KEY (FK_E_Clave, FK_TI_ID) REFERENCES Empleado (E_Clave, FK_TI_ID),
	CONSTRAINT asignado FOREIGN KEY (FK_H_Clave) REFERENCES Horario (H_Clave)
);

CREATE TABLE Vacacion (
	V_Clave			SERIAL,
	V_Fecha_Inicio	DATE			NOT NULL,
	V_Fecha_Fin		DATE			NOT NULL,
	CONSTRAINT PK_Vacacion PRIMARY KEY (V_Clave)
);

CREATE TABLE Vacacion_Empleado (
	FK_E_Clave		SERIAL,
	FK_V_Clave		SERIAL,
	FK_TI_ID		NUMERIC(10),
	CONSTRAINT PK_Vacacion_Empleado PRIMARY KEY (FK_E_Clave, FK_V_Clave, FK_TI_ID),
	CONSTRAINT vacaciona FOREIGN KEY (FK_E_Clave, FK_TI_ID) REFERENCES Empleado (E_Clave, FK_TI_ID),
	CONSTRAINT concedido FOREIGN KEY (FK_V_Clave) REFERENCES Vacacion (V_Clave)
);

CREATE TABLE Beneficio (
	B_Clave			SERIAL,
	B_Nombre		VARCHAR(20)		NOT NULL,
	B_Descripcion	VARCHAR(250)	NOT NULL,
	CONSTRAINT PK_Beneficio PRIMARY KEY (B_Clave)
);

CREATE TABLE Beneficio_Empleado (
	B_E_ID			SERIAL,
	FK_E_Clave		SERIAL,
	FK_B_Clave		SERIAL,
	FK_TI_ID		NUMERIC(10),
	CONSTRAINT PK_Beneficio_Empleado PRIMARY KEY (B_E_ID,FK_E_Clave, FK_B_Clave, FK_TI_ID),
	CONSTRAINT obtiene FOREIGN KEY (FK_E_Clave, FK_TI_ID) REFERENCES Empleado (E_Clave, FK_TI_ID),
	CONSTRAINT otorgado FOREIGN KEY (FK_B_Clave) REFERENCES Beneficio (B_Clave)
);

CREATE TABLE Rol (
	RO_Clave		SERIAL,
	RO_Nombre		VARCHAR(20)		NOT NULL,
	RO_Descripcion	VARCHAR(250)	NOT NULL,
	CONSTRAINT PK_Rol PRIMARY KEY (RO_Clave)
);

CREATE TABLE Accion (
	A_Clave			SERIAL,
	A_Nombre		VARCHAR(20)		NOT NULL,
	A_Descripcion	VARCHAR(250)	NOT NULL,
	CONSTRAINT PK_Accion PRIMARY KEY (A_Clave)
);

CREATE TABLE Rol_Accion (
	FK_RO_Clave		INTEGER,
	FK_A_Clave		SERIAL,
	CONSTRAINT PK_Rol_Accion PRIMARY KEY (FK_RO_Clave, FK_A_Clave),
	CONSTRAINT posee FOREIGN KEY (FK_RO_Clave) REFERENCES Rol (RO_Clave),
	CONSTRAINT se_realiza FOREIGN KEY (FK_A_Clave) REFERENCES Accion (A_Clave)
);

CREATE TABLE Usuario (
	U_Clave			SERIAL,
	U_Nombre		VARCHAR(20)		NOT NULL	UNIQUE,
	U_Contrasena	VARCHAR(8)		NOT NULL,
	FK_RO_Clave		INTEGER,
	FK_E_Clave		INTEGER,
	FK_CN_ID		INTEGER,
	FK_CJ_ID		INTEGER,
	FK_TI_ID		NUMERIC(10),
	CONSTRAINT PK_Usuario PRIMARY KEY (U_Clave),
	CONSTRAINT se_asigna FOREIGN KEY (FK_RO_Clave) REFERENCES Rol (RO_Clave),
	CONSTRAINT manipula FOREIGN KEY (FK_E_Clave, FK_TI_ID) REFERENCES Empleado (E_Clave, FK_TI_ID),
	CONSTRAINT maneja FOREIGN KEY (FK_CN_ID) REFERENCES Cliente_Natural (CN_ID),
	CONSTRAINT usa FOREIGN KEY (FK_CJ_ID) REFERENCES Cliente_Juridico (CJ_ID)
);

CREATE TABLE Persona_Contacto (
	PC_ID			SERIAL,
	PC_Nombre		VARCHAR(20)		NOT NULL,
	PC_Apellido		VARCHAR(20)		NOT NULL,
	FK_CJ_ID		SERIAL			NOT NULL,
	CONSTRAINT PK_Persona_Contacto PRIMARY KEY (PC_ID),
	CONSTRAINT contactar FOREIGN KEY (FK_CJ_ID) REFERENCES Cliente_Juridico (CJ_ID)
);

CREATE TABLE Telefono (
	TE_ID			SERIAL,
	TE_Cod_Area		NUMERIC(4)		NOT NULL,
	TE_Numero		NUMERIC(10)		NOT NULL,
	FK_CJ_ID		SERIAL,
	FK_CN_ID		SERIAL,
	FK_PC_ID		SERIAL,
	CONSTRAINT PK_Telefono PRIMARY KEY (TE_ID),
	CONSTRAINT atribuido FOREIGN KEY (FK_CJ_ID) REFERENCES Cliente_Juridico (CJ_ID),
	CONSTRAINT dispone FOREIGN KEY (FK_CN_ID) REFERENCES Cliente_Natural (CN_ID),
	CONSTRAINT contacto FOREIGN KEY (FK_PC_ID) REFERENCES Persona_Contacto (PC_ID)
);

CREATE TABLE Imagen_Producto (
	IP_ID		SERIAL,
	IP_Ruta		VARCHAR(250)	NOT NULL,
	FK_P_ID		SERIAL			NOT NULL,
	CONSTRAINT PK_Imagen_Producto PRIMARY KEY (IP_ID),
	CONSTRAINT imagen FOREIGN KEY (FK_P_ID) REFERENCES Producto (P_ID)
);

CREATE TABLE Asistencia (
	AS_ID					SERIAL,
	AS_Dia					VARCHAR(20)		NOT NULL,
	AS_Fecha_Hora_Entrada	TIMESTAMP,
	AS_Fecha_Hora_Salida	TIMESTAMP,
	FK_E_Clave				SERIAL			NOT NULL,
	FK_TI_ID				NUMERIC(10)		NOT NULL,
	CONSTRAINT PK_Asistencia PRIMARY KEY (AS_ID),
	CONSTRAINT asistio FOREIGN KEY (FK_E_Clave, FK_TI_ID) REFERENCES Empleado (E_Clave, FK_TI_ID),
	CONSTRAINT check_Asistencia CHECK (AS_Dia 
				IN ('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'))
);