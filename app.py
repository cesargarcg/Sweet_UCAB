from flask import Flask, request, jsonify, send_file
from psycopg2 import connect, extras
from cryptography.fernet import Fernet
import json

app = Flask(__name__)
key = Fernet.generate_key()

host = 'localhost'
port = 5432
dbname = 'postgres'
user = 'postgres'
password = 'Cesar24Diana14'


def get_connection(): #conectar con la bd
    conn = connect(host=host, port=port, dbname=dbname,
                   user=user, password=password)
    return conn


#--------------------------USUARIOS-------------------------------------
@app.get('/api/users')              #devuelve todos los usuarios
def get_users():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM usuario ORDER BY u_clave')
    users = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(users)

@app.post('/api/users')             #crea usuarios
def create_users():
    new_user = request.get_json()
    username = new_user['username']
    password = new_user['password'] #Fernet(key).encrypt(bytes(new_rol['password'], 'utf-8'))
    fk_cn_id = new_user['fk_cn_id']
    fk_cj_id = new_user['fk_cj_id']
    fk_ro_clave = new_user['fk_ro_id']
    fk_e_clave = new_user['fk_e_id']
    fk_ti_id = new_user['fk_ti_id']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('INSERT INTO usuario (u_nombre, u_contrasena, fk_cn_id, fk_cj_id, fk_ro_clave, fk_e_clave, fk_ti_id) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING *',
                (username, password, fk_cn_id, fk_cj_id, fk_ro_clave, fk_e_clave, fk_ti_id))
    new_user_created = cur.fetchone()
    print(new_user_created)
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(new_user_created)

@app.delete('/api/users/<id>')      #elimina usuarios
def delete_user(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('DELETE FROM usuario WHERE u_clave = %s RETURNING *',(id,))
    user = cur.fetchone()


    conn.commit()

    cur.close()
    conn.close()
    
    if user is None:
        return jsonify({'message':'User not found'}), 404
        
    return jsonify(user)

@app.put('/api/users/<id>')         #actualiza usuarios
def update_user(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    new_user = request.get_json()
    username = new_user['username']
    password = new_user['password']
    rol_clve = new_user['rol']
    empleado = new_user['empl']
    clnN = new_user['clnN']
    clnJ = new_user['clnJ']
    tind = new_user['tind']

    cur.execute('UPDATE usuario SET u_nombre = %s, u_contrasena = %s, fk_ro_clave = %s, fk_e_clave = %s, fk_cn_id= %s, fk_cj_id = %s, fk_ti_id = %s WHERE u_clave = %s RETURNING *', (username, password, rol_clve, empleado, clnN, clnJ, tind, id))

    updated_user = cur.fetchone()

    conn.commit()

    cur.close()
    conn.close()

    if updated_user is None:
        return jsonify({'message':'User not found'}), 404

    return jsonify(updated_user)

@app.get('/api/users/<id>')         #obtiene usuarios por id
def get_user_id(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM usuario WHERE u_clave = %s',(id,))
    user = cur.fetchone()

    
    cur.close()
    conn.close()

    if user is None:
        return jsonify({'message':'User not found'}), 404

    return jsonify(user)

#--------------------------CLIENTES NATURALES-------------------------------------

@app.post('/api/clienteNatural')    #crea clientes Naturales
def create_Cn():
    new_Cn = request.get_json()
    id = new_Cn['id']
    rif= new_Cn['rif']
    Pn = new_Cn['Pn']
    Sn = new_Cn['Sn']
    Pa = new_Cn['Pa']
    Sa = new_Cn['Sa']
    email = new_Cn['email']
    li = new_Cn['l_id']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('INSERT INTO cliente_natural (cn_rif, cn_ci, cn_prim_nom, cn_seg_nom, cn_prim_ap, cn_seg_ap, cn_correo, fk_l_id) VALUES (%s, %s, %s, %s, %s, %s, %s,%s) RETURNING *',
                (rif,id,Pn,Sn,Pa,Sa,email,li))
    new_Cn_Created = cur.fetchone()
    print(new_Cn_Created)
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(new_Cn_Created) 

@app.get('/api/clienteNatural/<id>')         #obtiene usuarios por id
def get_Cn_id(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM cliente_natural WHERE cn_id = %s',(id,))
    user = cur.fetchone()

    
    cur.close()
    conn.close()

    if user is None:
        return jsonify({'message':'Cliente not found'}), 404

    return jsonify(user)

@app.get('/api/clienteNaturalRif/<id>')    
def get_Cn_rif(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM cliente_natural WHERE cn_rif = %s',(id,))
    user = cur.fetchone()

    
    cur.close()
    conn.close()

    if user is None:
        return jsonify({'message':'Cliente not found'}), 404

    return jsonify(user)     

@app.get('/api/clientesNaturales')
def get_clientesN():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM cliente_natural ORDER BY cn_id')
    Cn = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Cn)

@app.delete('/api/clienteN/<id>')      #elimina clientes
def delete_client(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('DELETE FROM cliente_natural WHERE cn_id = %s RETURNING *',(id,))
    client = cur.fetchone()

    conn.commit()

    cur.close()
    conn.close()
    
    if client is None:
        return jsonify({'message':'User not found'}), 404
        
    return jsonify(client)

@app.put('/api/clienteN/<id>')         #actualiza usuarios
def update_clienteN(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    new_Cn = request.get_json()
    ci = new_Cn['ci']
    rif= new_Cn['rif']
    Pn = new_Cn['Pn']
    Sn = new_Cn['Sn']
    Pa = new_Cn['Pa']
    Sa = new_Cn['Sa']
    email = new_Cn['email']
    li = new_Cn['l_id']
    te_cod_area = new_Cn['te_cod_area']
    te_numero = new_Cn['te_numero']
 
    
    cur.execute('UPDATE cliente_natural SET cn_ci = %s, cn_rif = %s, cn_prim_nom = %s, cn_seg_nom = %s, cn_prim_ap= %s, cn_seg_ap = %s, cn_correo = %s, fk_l_id = %s WHERE cn_id = %s RETURNING *',(ci, rif, Pn, Sn, Pa, Sa, email, li, id))

    updated_user = cur.fetchone()

    conn.commit()

    cur.execute('UPDATE telefono SET te_cod_area = %s, te_numero = %s where fk_cn_id = %s RETURNING *',(te_cod_area,te_numero,id))
    conn.commit()

    cur.close()
    conn.close()

    if updated_user is None:
        return jsonify({'message':'User not found'}), 404

    return jsonify(updated_user)


#--------------------------CLIENTES JURIDICOS-------------------------------------

@app.post('/api/clienteJuridico')    #crea clientes Juridicos
def create_Cj():
    new_Cj = request.get_json()
    rif = new_Cj['rif']
    dencom = new_Cj['dencom']
    razsoc = new_Cj['razsoc']
    pagina = new_Cj['pagina']
    capital = new_Cj['capital']
    fiscal = new_Cj['fiscal']
    principal = new_Cj['principal']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('INSERT INTO cliente_juridico (cj_rif, cj_den_com, cj_raz_soc, cj_pag_web, cj_capital, fk_l_id, fk_l_id_2) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING *',
                (rif,dencom,razsoc,pagina,capital,fiscal,principal))
    
    new_Cj_Created = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(new_Cj_Created)

@app.put('/api/clienteJuridico/<id>')         #actualiza clientes Juridicos
def update_clienteJ(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    new_Cj = request.get_json()
    rif = new_Cj['rif']
    dencom= new_Cj['dencom']
    razsoc = new_Cj['razsoc']
    pagina = new_Cj['pagina']
    capital = new_Cj['capital']
    fiscal = new_Cj['fiscal']
    principal = new_Cj['principal']
    te_cod_area = new_Cj['te_cod_area']
    te_numero = new_Cj['te_numero']

    
    cur.execute('UPDATE cliente_juridico SET cj_rif = %s, cj_den_com = %s, cj_raz_soc = %s, cj_pag_web = %s, cj_capital = %s, fk_l_id = %s, fk_l_id_2 = %s WHERE cj_id = %s RETURNING *',(rif, dencom, razsoc, pagina, capital, fiscal, principal, id))

    updated_user = cur.fetchone()

    conn.commit()

    cur.execute('UPDATE telefono SET te_cod_area = %s, te_numero = %s where fk_cj_id = %s RETURNING *',(te_cod_area,te_numero,id))
    conn.commit()

    cur.close()
    conn.close()

    if updated_user is None:
        return jsonify({'message':'User not found'}), 404

    return jsonify(updated_user)

@app.get('/api/clienteJuridico/<id>')         #obtiene usuarios por id
def get_Cj_id(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM cliente_juridico WHERE cj_id = %s',(id,))
    user = cur.fetchone()

    
    cur.close()
    conn.close()

    if user is None:
        return jsonify({'message':'Cliente not found'}), 404

    return jsonify(user)

@app.get('/api/clienteJuridicoRif/<id>')
def get_Cj_rif(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM cliente_juridico WHERE cj_rif = %s',(id,))
    user = cur.fetchone()

    
    cur.close()
    conn.close()

    if user is None:
        return jsonify({'message':'Cliente not found'}), 404

    return jsonify(user)

@app.get('/api/clientesJuridicos')
def get_clientesJ():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM cliente_juridico ORDER BY cj_id')
    Cj = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Cj)

@app.delete('/api/clienteJ/<id>')      #elimina clientes
def delete_clientJ(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('DELETE FROM cliente_juridico WHERE cj_id = %s RETURNING *',(id,))
    clientj = cur.fetchone()


    conn.commit()

    cur.close()
    conn.close()
    
    if clientj is None:
        return jsonify({'message':'User not found'}), 404
        
    return jsonify(clientj)

#----------------------------PERSONAS DE CONTACTO---------------------------------

@app.post('/api/personaContacto')    #crea personas de contacto
def create_Pc():
    new_Pc = request.get_json()
    pc_nombre = new_Pc['pc_nombre']
    pc_apellido = new_Pc['pc_apellido']
    fk_cj_id = new_Pc['fk_cj_id']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('INSERT INTO persona_contacto (pc_nombre, pc_apellido, fk_cj_id) VALUES (%s, %s, %s) RETURNING *',
                (pc_nombre,pc_apellido,fk_cj_id))
    
    new_Pc_Created = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(new_Pc_Created)

#-------------------------------TELEFONOS-----------------------------------------

@app.post('/api/telefono')    #crea telefonos
def createTlf():
    new_Tlf = request.get_json()
    te_cod_area = new_Tlf['te_cod_area']
    te_numero = new_Tlf['te_numero']
    fk_pc_id = new_Tlf['fk_pc_id']
    fk_cj_id = new_Tlf['fk_juridico']
    fk_cn_id = new_Tlf['fk_natural']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('INSERT INTO telefono (te_cod_area, te_numero, fk_cj_id, fk_cn_id, fk_pc_id) VALUES (%s, %s, %s, %s, %s) RETURNING *',
                (te_cod_area,te_numero,fk_cj_id,fk_cn_id,fk_pc_id))
    
    new_Tlf_Created = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(new_Tlf_Created)

#-------------------------------LUGARES-------------------------------------------

@app.get('/api/lugarEstados')       #obtiene estados
def get_lugarEstados():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM lugar WHERE l_tipo = %s', ('Estado',))
    lugarEstados = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(lugarEstados)

@app.get('/api/lugar/<nombre>')     #obtiene lugares por nombre
def get_lugar_name(nombre):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM lugar WHERE l_nombre = %s',(nombre,))
    lugar = cur.fetchone()

    
    cur.close()
    conn.close()

    if lugar is None:
        return jsonify({'message':'Lugar not found'}), 404

    return jsonify(lugar)

#-------------------------------ROLES---------------------------------------------

@app.get('/api/roles')              #devuelve todos los roles
def get_roles():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM rol')
    roles = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(roles)

@app.get('/api/roles/<nombre>')     #BORRAR SI NADA SE CAE roles por nombre
def get_roles_name(nombre):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM rol WHERE ro_nombre = %s',(nombre,))
    rol = cur.fetchone()

    
    cur.close()
    conn.close()

    if rol is None:
        return jsonify({'message':'Rol not found'}), 404

    return jsonify(rol)


@app.get('/api/rolesI/<id>')         #devuelve roles por id
def get_roles_id(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM rol WHERE ro_clave = %s',(id,))
    rol = cur.fetchone()

    
    cur.close()
    conn.close()

    if rol is None:
        return jsonify({'message':'Rol not found'}), 404

    return jsonify(rol)

@app.post('/api/roles')             #crea roles
def create_roles():
    new_rol = request.get_json()
    nombreR = new_rol['nombre']
    desc = new_rol['desc']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('INSERT INTO rol (ro_nombre, ro_descripcion) VALUES (%s, %s) RETURNING *',
                (nombreR, desc))
    new_user_created = cur.fetchone()
    print(new_user_created)
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(new_user_created)

@app.delete('/api/roles/<id>')      #elimina roles
def delete_rol(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('UPDATE usuario SET fk_ro_clave = NULL WHERE fk_ro_clave = %s',(id,))

    cur.execute('DELETE FROM rol_accion WHERE fk_ro_clave = %s',(id,))
    conn.commit()

    cur.execute('DELETE FROM rol WHERE ro_clave = %s RETURNING *',(id,))
    rol = cur.fetchone()


    conn.commit()

    cur.close()
    conn.close()
    
    if rol is None:
        return jsonify({'message':'Rol not found'}), 404
        
    return jsonify(rol)

@app.put('/api/roles/<id>')         #actualiza roles
def update_rol(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    new_rol = request.get_json()
    username = new_rol['nombre']
    desc = new_rol['desc']


    cur.execute('UPDATE rol SET ro_nombre = %s, ro_descripcion = %s WHERE ro_clave = %s RETURNING *', (username, desc, id))

    updated_user = cur.fetchone()

    conn.commit()

    cur.close()
    conn.close()

    if updated_user is None:
        return jsonify({'message':'User not found'}), 404

    return jsonify(updated_user)

#---------------------------Productos-------------------------

@app.get('/api/productos') #devuelve todos los productos
def get_productos():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM producto')
    productos = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(productos)     

@app.get('/api/productos/<id>')         #devuelve productos por id
def get_productos_id(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM producto WHERE p_id = %s',(id,))
    prodct = cur.fetchone()

    
    cur.close()
    conn.close()

    if prodct is None:
        return jsonify({'message':'Producto not found'}), 404

    return jsonify(prodct)

@app.post('/api/productos') #crea un nuevo Producto
def create_Producto():
    new_Producto = request.get_json()

    nombre = new_Producto['nombre']
    precio = new_Producto['precio']
    descripcion = new_Producto['descripcion']
    peso = new_Producto['peso']
    imagen = new_Producto['imagen']
    TaClave = new_Producto['TaClave']
    FoClave = new_Producto['FoClave']
    CDClave = new_Producto['CDClave']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('INSERT INTO Producto (P_Nombre, P_Descripcion, P_Peso, P_Precio, FK_R_ID, FK_T_ID, FK_F_ID) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING *',
                (nombre, descripcion, peso, precio,CDClave,TaClave,FoClave))

    new_created_Producto = cur.fetchone()
    print(new_created_Producto)
    conn.commit()


    #creamos color_caramelo
    print("\n Colores: \n")
    for color in new_Producto['ColoresSeleccionados']: #debemos crear varios colores
        P_ID = new_created_Producto['p_id']
        C_ID = color
        cur.execute('INSERT INTO Producto_Color (FK_C_ID, FK_P_ID) VALUES (%s, %s) RETURNING *',
                    (C_ID, P_ID))
        new_created_Producto_Color = cur.fetchone()
        print(new_created_Producto_Color)

    #creamos sabor_caramelo
    print("\n Sabores: \n")
    for sabor in new_Producto['SaboresSeleccionados']:  # debemos crear varios sabores
        P_ID = new_created_Producto['p_id']
        S_ID = sabor
        cur.execute('INSERT INTO Producto_Sabor (FK_S_ID, FK_P_ID) VALUES (%s, %s) RETURNING *',
                    (S_ID, P_ID))
        new_created_Producto_Sabor = cur.fetchone()
        print(new_created_Producto_Sabor)

    conn.commit()

    cur.close()
    conn.close()

    return jsonify(new_created_Producto)

@app.put('/api/productos/<id>') #actualiza un producto
def update_producto(id):
    new_Producto = request.get_json()

    nombre = new_Producto['nombre']
    precio = new_Producto['precio']
    descripcion = new_Producto['descripcion']
    peso = new_Producto['peso']
    imagen = new_Producto['imagen']
    TaClave = new_Producto['TaClave']
    FoClave = new_Producto['FoClave']
    CDClave = new_Producto['CDClave']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('UPDATE Producto SET P_Nombre = %s, P_Descripcion = %s, P_Peso = %s, P_Precio = %s, FK_R_ID = %s, FK_T_ID = %s, FK_F_ID = %s WHERE p_id = %s RETURNING *',
                (nombre, descripcion, peso, precio,CDClave,TaClave,FoClave,id))

    new_created_Producto = cur.fetchone()
    print(new_created_Producto)
    conn.commit()

    cur.execute('DELETE FROM producto_color WHERE fk_p_id = %s',(id,))
    conn.commit()
    for color in new_Producto['ColoresSeleccionados']: #debemos crear varios colores
        P_ID = new_created_Producto['p_id']
        C_ID = color     
        cur.execute('INSERT INTO Producto_Color (FK_C_ID, FK_P_ID) VALUES (%s, %s) RETURNING *',
                    (C_ID, P_ID))
        new_created_Producto_Color = cur.fetchone()
        print(new_created_Producto_Color)

    cur.execute('DELETE FROM producto_sabor WHERE fk_p_id = %s',(id,))
    conn.commit()
    print("\n Sabores: \n")
    for sabor in new_Producto['SaboresSeleccionados']:  # debemos crear varios sabores
        P_ID = new_created_Producto['p_id']
        S_ID = sabor       
        cur.execute('INSERT INTO Producto_Sabor (FK_S_ID, FK_P_ID) VALUES (%s, %s) RETURNING *',
                    (S_ID, P_ID))
        new_created_Producto_Sabor = cur.fetchone()
        print(new_created_Producto_Sabor)

    conn.commit()

    cur.close()
    conn.close()

    return jsonify(new_created_Producto)

@app.delete('/api/productos/<id>')      #elimina productos
def delete_producto(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('DELETE FROM producto_sabor WHERE fk_p_id = %s',(id,))
    conn.commit()

    cur.execute('DELETE FROM producto_color WHERE fk_p_id = %s',(id,))
    conn.commit()

    cur.execute('DELETE FROM producto WHERE p_id = %s RETURNING *',(id,))
    producto = cur.fetchone()


    conn.commit()

    cur.close()
    conn.close()
    
    if producto is None:
        return jsonify({'message':'Producto not found'}), 404
        
    return jsonify(producto)

@app.get('/api/rubros') #devuelve todos los rubros
def get_rubros():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM Rubro')
    rubros = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(rubros)  

@app.get('/api/sabores') #devuelve todos los sabores
def get_sabores():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM Sabor')
    sabores = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(sabores)

@app.get('/api/colores') #devuelve todos los colores
def get_colores():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM Color')
    colores = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(colores)

@app.get('/api/productoColor') #devuelve todos los colores
def get_productocolores():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM producto_color')
    colores = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(colores)

@app.get('/api/productoSabor') #devuelve todos los colores
def get_productosabores():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM producto_sabor')
    sabores = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(sabores)          

@app.get('/api/productoColor/<id>')         #devuelve roles por id
def get_productoColor_id(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM producto_color WHERE fk_p_id = %s',(id,))
    rol = cur.fetchall()

    
    cur.close()
    conn.close()

    if rol is None:
        return jsonify({'message':'Rol not found'}), 404

    return jsonify(rol)

@app.get('/api/tamanos') #devuelve todos los tamanos
def get_tamanos():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM Tamano')
    tamanos = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(tamanos)

@app.get('/api/formas') #devuelve todas los formas
def get_formas():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM Forma')
    formas = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(formas) 

#---------------------------------ACCIONES---------------------------------

@app.get('/api/acciones/')
def get_acciones():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM accion')
    accion = cur.fetchall()
    
    cur.close()
    conn.close()

    if accion is None:
        return jsonify({'message':'Accion not found'}), 404

    return jsonify(accion)

@app.get('/api/roles_accion/<id>')  
def get_roles_accion_id(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM rol_accion WHERE fk_ro_clave = %s',(id,))
    rol = cur.fetchall()

    
    cur.close()
    conn.close()

    if rol is None:
        return jsonify({'message':'Rol not found'}), 404

    return jsonify(rol)

@app.get('/api/accion/<id>')
def get_accion_id(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM accion WHERE a_clave = %s',(id,))
    rol = cur.fetchone()

    
    cur.close()
    conn.close()

    if rol is None:
        return jsonify({'message':'Accion not found'}), 404

    return jsonify(rol)

@app.post('/api/rol_accion') #crea relaciones rol-accion
def create_roles_accion():
    new_rol = request.get_json()
    ro_id = new_rol['ro_id']
    accid = new_rol['accid']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('INSERT INTO rol_accion (fk_ro_clave, fk_a_clave) VALUES (%s, %s) RETURNING *',
                (ro_id, accid))
    new_rolA_created = cur.fetchone()
    print(new_rolA_created)
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(new_rolA_created)    

@app.delete('/api/rol_accion/<id>')      #elimina roles
def delete_rol_accion(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)


    cur.execute('DELETE FROM rol_accion WHERE fk_ro_clave = %s RETURNING *',(id,))
    rol_accion = cur.fetchall()

    conn.commit()

    cur.close()
    conn.close()
    
    if rol_accion is None:
        return jsonify({'message':'Rol not found'}), 404
        
    return jsonify(rol_accion)

@app.put('/api/rol_accion/<id>')         #actualiza relaciones rol-accion
def update_rol_accion(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    new_rol_accion = request.get_json()
    fk_ro_clave = new_rol_accion['ro_id']
    accid = new_rol_accion['accid']
    
    cur.execute('INSERT INTO rol_accion (fk_ro_clave, fk_a_clave) VALUES (%s, %s) RETURNING *', (fk_ro_clave, accid))

    updated_user = cur.fetchone()

    conn.commit()

    cur.close()
    conn.close()

    if updated_user is None:
        return jsonify({'message':'User not found'}), 404

    return jsonify(updated_user)


#--------------------------------ELSE--------------------------------------

@app.post('/api/login/')
def get_user_username():
    user_login = request.get_json()
    username = user_login['username']
    password = user_login['password'] #Fernet(key).encrypt(bytes(user_login['password'], 'utf-8'))
    
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM usuario WHERE (u_nombre=%s AND u_contrasena=%s) ;',(username,password,))
    user = cur.fetchone()

    
    cur.close()
    conn.close()

    if user is None:
        return jsonify({'message':'User not found'}), 404

    return jsonify(user)    

@app.get('/api/metodoPagoCN/<id>')  
def get_metodoPagosCN_id(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM metodo_pago WHERE fk_cn_id = %s',(id,))
    rol = cur.fetchall()

    
    cur.close()
    conn.close()

    if rol is None:
        return jsonify({'message':'Rol not found'}), 404

    return jsonify(rol)

@app.get('/api/metodoPuntosCN/<id>')
def get_metodoPuntosCN_id(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    tipo = 'Puntos'

    cur.execute('SELECT * FROM metodo_pago WHERE fk_cn_id = %s AND mp_tipo = %s',(id,tipo,))
    mp = cur.fetchone()

    
    cur.close()
    conn.close()

    if mp is None:
        return jsonify({'message':'Metodo not found'}), 404

    return jsonify(mp)

@app.put('/api/sumarPuntoCN/<id>')
def sumar_punto(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    tipo = 'Puntos'

    cur.execute('UPDATE metodo_pago SET mp_cantidad_puntos = mp_cantidad_puntos + 1 WHERE fk_cn_id = %s AND mp_tipo = %s RETURNING *',(id,tipo))
    updated_metodo = cur.fetchone()

    conn.commit()

    cur.close()
    conn.close()

    if updated_metodo is None:
        return jsonify({'message':'User not found'}), 404

    return jsonify(updated_metodo)

@app.put('/api/restarPuntoCN/<id>')
def restar_punto(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    tipo = 'Puntos'

    cur.execute('UPDATE metodo_pago SET mp_cantidad_puntos = mp_cantidad_puntos - 1 WHERE fk_cn_id = %s AND mp_tipo = %s RETURNING *',(id,tipo))
    updated_metodo = cur.fetchone()

    conn.commit()

    cur.close()
    conn.close()

    if updated_metodo is None:
        return jsonify({'message':'User not found'}), 404

    return jsonify(updated_metodo)

@app.get('/api/metodoPuntosCJ/<id>')
def get_metodoPuntosCJ_id(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    tipo = 'Puntos'

    cur.execute('SELECT * FROM metodo_pago WHERE fk_cj_id = %s AND mp_tipo = %s',(id,tipo))
    mp = cur.fetchone()

    
    cur.close()
    conn.close()

    if mp is None:
        return jsonify({'message':'Metodo not found'}), 404

    return jsonify(mp)

@app.put('/api/sumarPuntoCJ/<id>')
def sumar_puntoCJ(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    tipo = 'Puntos'

    cur.execute('UPDATE metodo_pago SET mp_cantidad_puntos = mp_cantidad_puntos + 1 WHERE fk_cj_id = %s AND mp_tipo = %s RETURNING *',(id,tipo))
    updated_metodo = cur.fetchone()

    conn.commit()

    cur.close()
    conn.close()

    if updated_metodo is None:
        return jsonify({'message':'User not found'}), 404

    return jsonify(updated_metodo)

@app.put('/api/restarPuntoCJ/<id>')
def restar_puntoCJ(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    tipo = 'Puntos'

    cur.execute('UPDATE metodo_pago SET mp_cantidad_puntos = mp_cantidad_puntos - 1 WHERE fk_cj_id = %s AND mp_tipo = %s RETURNING *',(id,tipo))
    updated_metodo = cur.fetchone()

    conn.commit()

    cur.close()
    conn.close()

    if updated_metodo is None:
        return jsonify({'message':'User not found'}), 404

    return jsonify(updated_metodo)

@app.get('/api/metodoPagoCJ/<id>')  
def get_metodoPagosCJ_id(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM metodo_pago WHERE fk_cj_id = %s ',(id,))
    rol = cur.fetchall()

    
    cur.close()
    conn.close()

    if rol is None:
        return jsonify({'message':'Rol not found'}), 404

    return jsonify(rol)    

@app.get('/api/metodoPago/<id>')
def get_metodoPagos_id(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM metodo_pago WHERE mp_id = %s',(id,))
    rol = cur.fetchone()

    
    cur.close()
    conn.close()

    if rol is None:
        return jsonify({'message':'Metodo not found'}), 404

    return jsonify(rol)


@app.post('/api/metodoPago')
def create_metodoPago():
    new_mp =  request.get_json()

    MP_Nombre = new_mp['MP_Nombre']
    MP_Tipo_Tarjeta = new_mp['MP_Tipo_Tarjeta']
    MP_Numero_Tarjeta = new_mp['MP_Numero_Tarjeta']
    MP_Correo_Zelle = new_mp['MP_Correo_Zelle']
    MP_Banco_PagoMovil = new_mp['MP_Banco_PagoMovil']
    MP_Correo_PayPal = new_mp['MP_Correo_PayPal']
    MP_Nombre_PayPal = new_mp['MP_Nombre_PayPal']
    MP_Tipo_Efectivo = new_mp['MP_Tipo_Efectivo']
    MP_Cantidad_Puntos = new_mp['MP_Cantidad_Puntos']
    MP_Tipo = new_mp['MP_Tipo']
    FK_CN_ID = new_mp['FK_CN_ID']
    FK_CJ_ID = new_mp['FK_CJ_ID']

    conn = get_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO metodo_pago (MP_Nombre,MP_Tipo_Tarjeta,MP_Numero_Tarjeta,MP_Correo_Zelle,MP_Banco_PagoMovil,MP_Correo_Paypal,MP_Nombre_Paypal,MP_Tipo_Efectivo,MP_Cantidad_Puntos,MP_Tipo,FK_CN_ID,FK_CJ_ID) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *', (MP_Nombre,MP_Tipo_Tarjeta,MP_Numero_Tarjeta,MP_Correo_Zelle,MP_Banco_PagoMovil,MP_Correo_PayPal,MP_Nombre_PayPal,MP_Tipo_Efectivo,MP_Cantidad_Puntos,MP_Tipo,FK_CN_ID,FK_CJ_ID))
    mp = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return jsonify(mp)

@app.post('/api/pedidoOnline')
def create_pedidoOnline():
    new_po =  request.get_json()

    pe_monto_total = new_po['total']
    fk_cn_id = new_po['fk_cn_id']
    fk_cj_id = new_po['fk_cj_id']


    conn = get_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO pedido_online (pe_monto_total, fk_cn_id, fk_cj_id) VALUES (%s,%s,%s) RETURNING *', (pe_monto_total, fk_cn_id, fk_cj_id))
    mp = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    print(jsonify(mp))
    return jsonify(mp)

@app.post('/api/pedidoFisico')
def create_pedidoFisico():
    new_pf = request.get_json()

    pe_monto_total = new_pf['total']
    fk_cn_id = new_pf['fk_cn_id']
    fk_cj_id = new_pf['fk_cj_id']
    fk_ti_id = new_pf['fk_ti_id']

    conn = get_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO pedido_fisico (pe_monto_total, fk_cn_id, fk_cj_id, fk_ti_id) VALUES (%s,%s,%s,%s) RETURNING *', (pe_monto_total, fk_cn_id, fk_cj_id, fk_ti_id))
    mp = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    print(jsonify(mp))
    return jsonify(mp)

@app.post('/api/pedidoFabrica')
def create_pedidoFabrica():
    new_pf = request.get_json()

    pe_cantidad = new_pf['pe_cantidad']
    fk_ti_id = new_pf['fk_ti_id']

    conn = get_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO pedido_fabrica (pf_cantidad, fk_ti_id) VALUES (%s,%s) RETURNING *', (pe_cantidad, fk_ti_id))
    mp = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    print(jsonify(mp))
    return jsonify(mp)

@app.get('/api/ultimoDetallePedido/')
def get_ultimoDetallePedido():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT dp_id FROM detalle_pedido ORDER BY dp_id desc limit 1')
    accion = cur.fetchall()
    
    cur.close()
    conn.close()

    if accion is None:
        return jsonify({'message':'Accion not found'}), 404

    return jsonify(accion)

@app.get('/api/detallesPedidosFabrica/<id>')
def get_detallesPedidos(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM detalle_pedido WHERE fk_pf_id = %s', (id))
    accion = cur.fetchone()
    
    cur.close()
    conn.close()

    if accion is None:
        return jsonify({'message':'Accion not found'}), 404

    return jsonify(accion)

@app.post('/api/detallePedido')
def create_detallePedido():
    new_po =  request.get_json()

    dp_id = new_po['dp_id']
    fk_p_id = new_po['fk_p_id']
    dp_cantidad = new_po['dp_cantidad']
    fk_pe_online_id = new_po['fk_pe_online_id']


    conn = get_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO detalle_pedido (dp_id,fk_p_id,dp_cantidad,fk_pe_online_id) VALUES (%s,%s,%s,%s) RETURNING *', (dp_id, fk_p_id, dp_cantidad, fk_pe_online_id))
    mp = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return jsonify(mp)

@app.post('/api/detallePedidoFisico')
def create_detallePedidoFisico():
    new_po =  request.get_json()

    dp_id = new_po['dp_id']
    fk_p_id = new_po['fk_p_id']
    dp_cantidad = new_po['dp_cantidad']
    fk_pe_fisico_id = new_po['fk_pe_fisico_id']
    fk_ti_id = new_po['fk_ti_id']


    conn = get_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO detalle_pedido (dp_id,fk_p_id,dp_cantidad,fk_pe_fisico_id, fk_ti_id) VALUES (%s,%s,%s,%s,%s) RETURNING *', (dp_id, fk_p_id, dp_cantidad, fk_pe_fisico_id,fk_ti_id))
    mp = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return jsonify(mp)

@app.post('/api/detallePedidoFabrica')
def create_detallePedidoFabrica():
    new_po =  request.get_json()

    dp_id = new_po['dp_id']
    fk_p_id = new_po['fk_p_id']
    dp_cantidad = new_po['pe_cantidad']
    fk_pf_id = new_po['fk_pf_id']
    fk_ti_id = new_po['fk_ti_id']


    conn = get_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO detalle_pedido (dp_id,fk_p_id,dp_cantidad,fk_pf_id, fk_ti_id) VALUES (%s,%s,%s,%s,%s) RETURNING *', (dp_id, fk_p_id, dp_cantidad, fk_pf_id,fk_ti_id))
    mp = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return jsonify(mp)

@app.post('/api/estatusPedidoOnline')
def create_estatusPedidoOnline():
    new_po =  request.get_json()

    fk_pe_id = new_po['fk_pe_online_id']
    fk_es_clave = 1
    es_pe_fecha = new_po['es_pe_fecha']


    conn = get_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO estatus_pedido_online (fk_pe_id,fk_es_clave,es_pe_fecha) VALUES (%s,%s,%s) RETURNING *', (fk_pe_id, fk_es_clave, es_pe_fecha))
    mp = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return jsonify(mp)

@app.post('/api/estatusPedidoFisico')
def create_estatusPedidoFisico():
    new_po =  request.get_json()

    fk_pe_id = new_po['fk_pe_fisico_id']
    fk_es_clave = 1
    es_pe_fecha = new_po['es_pe_fecha']


    conn = get_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO estatus_pedido_fisico (fk_pe_id,fk_es_clave,es_pe_fecha) VALUES (%s,%s,%s) RETURNING *', (fk_pe_id, fk_es_clave, es_pe_fecha))
    mp = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return jsonify(mp)

@app.post('/api/estatusPedidoFabrica')
def create_estatusPedidoFabrica():
    new_po =  request.get_json()

    fk_pe_id = new_po['fk_pf_id']
    fk_es_clave = 3
    es_pe_fecha = new_po['es_pe_fecha']
    fk_ti_id = new_po['fk_ti_id']


    conn = get_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO estatus_pedido_fabrica (fk_pf_id,fk_es_clave,es_pe_fecha,fk_ti_id) VALUES (%s,%s,%s,%s) RETURNING *', (fk_pe_id, fk_es_clave, es_pe_fecha,fk_ti_id))
    mp = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return jsonify(mp)

@app.post('/api/metodopago_online')
def create_metodopago_online():
    new_po =  request.get_json()

    fk_mp_id = new_po['fk_mp_id']
    fk_pe_id = new_po['fk_pe_online_id']
    mp_monto_cancelado = new_po['mp_monto_cancelado']

    conn = get_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO metodopago_online (fk_mp_id,fk_pe_id,mp_monto_cancelado) VALUES (%s,%s,%s) RETURNING *', (fk_mp_id, fk_pe_id, mp_monto_cancelado ))
    mp = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return jsonify(mp)

@app.post('/api/metodopago_fisico')
def create_metodopago_fisico():
    new_po =  request.get_json()

    fk_mp_id = new_po['fk_mp_id']
    fk_pe_id = new_po['fk_pe_fisico_id']
    mp_monto_cancelado = new_po['mp_monto_cancelado']

    conn = get_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO metodopago_fisico (fk_mp_id,fk_pe_id,mp_monto_cancelado) VALUES (%s,%s,%s) RETURNING *', (fk_mp_id, fk_pe_id, mp_monto_cancelado ))
    mp = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return jsonify(mp)

@app.get('/api/pedidos')
def get_pedidos():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM pedido_online ORDER BY pe_id')
    pedido = cur.fetchall()
    
    cur.close()
    conn.close()

    if pedido is None:
        return jsonify({'message':'Pedido not found'}), 404

    return jsonify(pedido)

@app.get('/api/pedidosFisicos')
def get_pedidosFisicos():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM pedido_fisico ORDER BY pe_id')
    pedido = cur.fetchall()
    
    cur.close()
    conn.close()

    if pedido is None:
        return jsonify({'message':'Pedido not found'}), 404

    return jsonify(pedido)

@app.get('/api/pedidosFabrica')
def get_pedidosFabrica():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM pedido_fabrica ORDER BY pf_id')
    pedido = cur.fetchall()
    
    cur.close()
    conn.close()

    if pedido is None:
        return jsonify({'message':'Pedido not found'}), 404

    return jsonify(pedido)

#----------------------PEDIDOS DE PASILLOS----------------------

@app.get('/api/pedidosPasillo')
def get_pedidosPasillo():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM pedido_pasillo ORDER BY pp_id')
    pedido = cur.fetchall()
    
    cur.close()
    conn.close()

    if pedido is None:
        return jsonify({'message':'Pedido not found'}), 404

    return jsonify(pedido)

@app.post('/api/pedidosPasillo')
def create_pedidosPasillo():
    new_po =  request.get_json()

    fk_ti_id = new_po['fk_ti_id']
    fk_p_id = new_po['fk_p_id']
    cantidad = 100

    conn = get_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO pedido_pasillo (fk_ti_id,fk_p_id,pp_cantidad) VALUES (%s,%s,%s) RETURNING *', (fk_ti_id, fk_p_id, cantidad))
    mp = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return jsonify(mp)

@app.delete('/api/pedidosPasillo/<id>')
def delete_pedidosPasillo(id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM pedido_pasillo WHERE pp_id = %s', (id,))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'message':'Pedido deleted'})




#--------------------------------------------------------
@app.get('/api/estatus')
def get_estatus():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM estatus')
    estatus = cur.fetchall()
    
    cur.close()
    conn.close()
    
    if estatus is None:
        return jsonify({'message':'Estatus not found'}), 404
    
    return jsonify(estatus)

@app.get('/api/estatusPedidos')
def get_estatus_online():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM estatus_pedido_online ORDER BY es_pe_id')
    estatus = cur.fetchall()
    
    cur.close()
    conn.close()

    if estatus is None:
        return jsonify({'message':'estatus not found'}), 404

    return jsonify(estatus)

@app.get('/api/estatusPedidosFisicos')
def get_estatus_fisico():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM estatus_pedido_fisico ORDER BY es_pe_id')
    estatus = cur.fetchall()
    
    cur.close()
    conn.close()

    if estatus is None:
        return jsonify({'message':'estatus not found'}), 404

    return jsonify(estatus)

@app.get('/api/estatusPedidosFabrica')
def get_estatus_fabrica():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM estatus_pedido_fabrica ORDER BY es_pf_id')
    estatus = cur.fetchall()
    
    cur.close()
    conn.close()

    if estatus is None:
        return jsonify({'message':'estatus not found'}), 404

    return jsonify(estatus)


@app.put('/api/estatusPedidos/<id>')
def update_estatus_online(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    new_estatus = request.get_json()
    es_clave = new_estatus['estatus']

    cur.execute('UPDATE estatus_pedido_online SET fk_es_clave=%s WHERE fk_pe_id=%s RETURNING *', (es_clave, id))
    new_estatus_pedido = cur.fetchone()
    print(new_estatus_pedido)

    conn.commit()
    cur.close()
    conn.close()

    return jsonify(new_estatus_pedido)

@app.put('/api/estatusPedidosFisicos/<id>')
def update_estatus_fisico(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    new_estatus = request.get_json()
    es_clave = new_estatus['estatus']

    cur.execute('UPDATE estatus_pedido_fisico SET fk_es_clave=%s WHERE fk_pe_id=%s RETURNING *', (es_clave, id))
    new_estatus_pedido = cur.fetchone()
    print(new_estatus_pedido)

    conn.commit()
    cur.close()
    conn.close()

    return jsonify(new_estatus_pedido)

@app.put('/api/estatusPedidosFabrica/<id>')
def update_estatus_fabrica(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    new_estatus = request.get_json()
    es_clave = new_estatus['estatus']

    cur.execute('UPDATE estatus_pedido_fabrica SET fk_es_clave=%s WHERE fk_pf_id=%s RETURNING *', (es_clave, id))
    new_estatus_pedido = cur.fetchone()
    print(new_estatus_pedido)

    conn.commit()
    cur.close()
    conn.close()

    return jsonify(new_estatus_pedido)

@app.get('/api/pedidos/<id>')         #devuelve pedidos por id
def get_pedidos_id(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM pedido_online WHERE pe_id = %s',(id,))
    pedido = cur.fetchone()

    
    cur.close()
    conn.close()

    if pedido is None:
        return jsonify({'message':'Pedido not found'}), 404

    return jsonify(pedido)

@app.get('/api/pedidosFisicos/<id>')         #devuelve pedidos por id
def get_pedidosFisicos_id(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM pedido_fisico WHERE pe_id = %s',(id,))
    pedido = cur.fetchone()

    
    cur.close()
    conn.close()

    if pedido is None:
        return jsonify({'message':'Pedido not found'}), 404

    return jsonify(pedido)

@app.get('/api/pedidosFabrica/<id>')         #devuelve pedidos por id
def get_pedidosFabrica_id(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM pedido_fabrica WHERE pf_id = %s',(id,))
    pedido = cur.fetchone()

    
    cur.close()
    conn.close()

    if pedido is None:
        return jsonify({'message':'Pedido not found'}), 404

    return jsonify(pedido)



#----------------------------EMPLEADOS---------------------------------------

@app.get('/api/empleados')
def get_empleados():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM empleado')
    empleados = cur.fetchall()
    
    cur.close()
    conn.close()

    if empleados is None:
        return jsonify({'message':'Empleado not found'}), 404

    return jsonify(empleados)

@app.get('/api/empleados/<id>')
def get_empleados_id(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM empleado WHERE e_clave = %s',(id,))
    empleado = cur.fetchone()

    
    cur.close()
    conn.close()

    if empleado is None:
        return jsonify({'message':'Empleado not found'}), 404

    return jsonify(empleado)

@app.post('/api/empleados')
def create_empleados():
    new_empleado =  request.get_json()

    e_nombre = new_empleado['e_nombre']
    e_apellido = new_empleado['e_apellido']
    e_ci = new_empleado['e_ci']
    e_salario = new_empleado['e_salario']
    fk_ti_id = new_empleado['fk_ti_id']

    conn = get_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO empleado (e_nombre,e_apellido,e_ci,e_salario,fk_ti_id) VALUES (%s,%s,%s,%s,%s) RETURNING *', (e_nombre, e_apellido, e_ci, e_salario, fk_ti_id ))
    empleado = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return jsonify(empleado)



#-----------------------------TIENDAS-------------------------------------

@app.get('/api/tiendas')
def get_tiendas():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM tienda')
    tienda = cur.fetchall()
    
    cur.close()
    conn.close()

    if tienda is None:
        return jsonify({'message':'Tienda not found'}), 404

    return jsonify(tienda)

@app.get('/api/tiendas/<id>')
def get_tiendas_id(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM tienda WHERE ti_id = %s',(id,))
    tienda = cur.fetchone()

    
    cur.close()
    conn.close()

    if tienda is None:
        return jsonify({'message':'Tienda not found'}), 404

    return jsonify(tienda)


#-----------------------------MANEJO INVENTARIO-------------------------------------

@app.put('/api/restarPasillo/<id>/<id2>/<id3>')
def restar_pasillo(id,id2,id3):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('UPDATE zona_pasillo SET zp_cantidad_disp = zp_cantidad_disp - %s WHERE zp_id=%s AND fk_pa_id=%s RETURNING *', (id3, id, id2))
    updated_zona_pasillo = cur.fetchone()

    conn.commit()
    cur.close()
    conn.close()

    if updated_zona_pasillo is None:
        return jsonify({'message':'Zona pasillo not found'}), 404

    return jsonify(updated_zona_pasillo)

@app.put('/api/sumarPasillo/<id>/<id2>/<id3>')
def sumar_pasillo(id,id2,id3):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('UPDATE zona_pasillo SET zp_cantidad_disp = zp_cantidad_disp + %s WHERE zp_id=%s AND fk_pa_id=%s RETURNING *', (id3, id, id2))
    updated_zona_pasillo = cur.fetchone()

    conn.commit()
    cur.close()
    conn.close()

    if updated_zona_pasillo is None:
        return jsonify({'message':'Zona pasillo not found'}), 404

    return jsonify(updated_zona_pasillo)

@app.get('/api/productoPasillo/<id>/<id2>') #DEVUELVE EL PRODUCTO DE UN PASILLO
def get_cantidad_producto_pasillo(id,id2):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM zona_pasillo WHERE zp_id = %s AND fk_pa_id = %s',(id,id2))
    producto = cur.fetchone()

    cur.close()
    conn.close()

    if producto is None:
        return jsonify({'message':'Producto not found'}), 404

    return jsonify(producto)


@app.put('/api/restarAlmacen/<id>/<id2>/<id3>')
def restar_almacen(id,id2,id3):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('UPDATE zona_almacen SET zal_cantidad_disp = zal_cantidad_disp - %s WHERE zal_id=%s AND fk_al_id=%s RETURNING *', (id3, id, id2))
    updated_zona_almacen = cur.fetchone()

    conn.commit()
    cur.close()
    conn.close()

    if updated_zona_almacen is None:
        return jsonify({'message':'Zona almacen not found'}), 404

    return jsonify(updated_zona_almacen)

@app.put('/api/sumarAlmacen/<id>/<id2>/<id3>')
def sumar_almacen(id,id2,id3):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('UPDATE zona_almacen SET zal_cantidad_disp = zal_cantidad_disp + %s WHERE zal_id=%s AND fk_al_id=%s RETURNING *', (id3, id, id2))
    updated_zona_almacen = cur.fetchone()

    conn.commit()
    cur.close()
    conn.close()

    if updated_zona_almacen is None:
        return jsonify({'message':'Zona almacen not found'}), 404

    return jsonify(updated_zona_almacen)

@app.get('/api/productoAlmacen/<id>/<id2>')
def get_cantidad_producto_almacen(id,id2):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM zona_almacen WHERE zal_id = %s AND fk_al_id = %s',(id,id2))
    producto = cur.fetchone()

    cur.close()
    conn.close()

    if producto is None:
        return jsonify({'message':'Producto not found'}), 404

    return jsonify(producto)


@app.put('/api/restarInventario/<id>/<id2>/<id3>')
def restar_inventario(id,id2,id3):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('UPDATE inventario SET i_cantidad = i_cantidad - %s WHERE fk_p_id=%s AND fk_ti_id=%s RETURNING *', (id3, id, id2))
    updated_inventario = cur.fetchone()

    conn.commit()
    cur.close()
    conn.close()

    if updated_inventario is None:
        return jsonify({'message':'Inventario not found'}), 404

    return jsonify(updated_inventario)

@app.put('/api/sumarInventario/<id>/<id2>/<id3>')
def sumar_inventario(id,id2,id3):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('UPDATE inventario SET i_cantidad = i_cantidad + %s WHERE fk_p_id=%s AND fk_ti_id=%s RETURNING *', (id3, id, id2))
    updated_inventario = cur.fetchone()

    conn.commit()
    cur.close()
    conn.close()

    if updated_inventario is None:
        return jsonify({'message':'Inventario not found'}), 404

    return jsonify(updated_inventario)


#------------------------------ASISTENCIA--------------------------------------

@app.post('/api/asistencia')
def post_asistencia():
    new_as = request.get_json()

    a_dia= new_as['a_dia']
    a_horaentrada = new_as['a_horaentrada']
    a_horasalida = new_as['a_horasalida']
    em_clave = new_as['em_clave']
    a_fecha = new_as['a_fecha']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('INSERT INTO asistencia (as_dia,as_hora_entrada,as_hora_salida,fk_e_clave,as_fecha) VALUES (%s,%s,%s,%s,%s) RETURNING *', (a_dia,a_horaentrada, a_horasalida, em_clave,a_fecha))
    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return jsonify(user)

@app.delete('/api/asistencia/delete')
def delete_asistencia():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('DELETE FROM asistencia')
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'asistencia eliminada'})


#-------------------------------------REPORTE DE ASISTENCIA--------------------------------------------

@app.get('/api/asistencia/gt')
def get_asistencia():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select * from asistencia ')
    user = cur.fetchall()

    json_str = json.dumps(user, default=str)


    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return json_str


@app.get('/api/asistencia/empleados')
def get_asistencia_empleados():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select distinct(fk_e_clave) from asistencia')
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)


#Primer trimestre para las inasistencias
@app.get('/api/asistencia/primerTrimestre/<id>')
def get_asistencia_primerTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) from asistencia aa,empleado e where (aa.fk_e_clave = %s and e.e_clave = %s) and (aa.as_hora_entrada is null and aa.as_hora_salida is null) and (aa.as_fecha between %s and %s)', (id,id,'2022-01-01','2022-03-31'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#Segundo trimestre para las inasistencias
@app.get('/api/asistencia/segundoTrimestre/<id>')
def get_asistencia_segundoTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) from asistencia aa,empleado e where (aa.fk_e_clave = %s and e.e_clave = %s) and (aa.as_hora_entrada is null and aa.as_hora_salida is null) and (aa.as_fecha between %s and %s)', (id,id,'2022-04-01','2022-06-30'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#Tercer trimestre para las inasistencias
@app.get('/api/asistencia/tercerTrimestre/<id>')
def get_asistencia_tercerTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) from asistencia aa,empleado e where (aa.fk_e_clave = %s and e.e_clave = %s) and (aa.as_hora_entrada is null and aa.as_hora_salida is null) and (aa.as_fecha between %s and %s)', (id,id,'2022-07-01','2022-09-30'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#Cuarto trimestre para las inasistencias
@app.get('/api/asistencia/cuartoTrimestre/<id>')
def get_asistencia_cuartoTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) from asistencia aa,empleado e where (aa.fk_e_clave = %s and e.e_clave = %s) and (aa.as_hora_entrada is null and aa.as_hora_salida is null) and (aa.as_fecha between %s and %s)', (id,id,'2022-10-01','2022-12-31'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)
    

#llegada tarde primer trimestre
@app.get('/api/asistencia/llegadaTardePrimerTrimestre/<id>')
def get_asistencia_llegadaTardePrimerTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) FROM asistencia aa, empleado e WHERE  ((aa.fk_e_clave = %s) and (e.e_clave = %s)) AND  (aa.as_hora_entrada > any (select h_hora_inicio FROM horario where e.e_clave = fk_e_clave and h_dia = aa.as_dia)) AND (aa.as_fecha between %s and %s)', (id,id,'2022-01-01','2022-03-31'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#llegada tarde segundo trimestre
@app.get('/api/asistencia/llegadaTardeSegundoTrimestre/<id>')
def get_asistencia_llegadaTardeSegundoTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) FROM asistencia aa, empleado e WHERE  ((aa.fk_e_clave = %s) and (e.e_clave = %s)) AND  (aa.as_hora_entrada > any (select h_hora_inicio FROM horario where e.e_clave = fk_e_clave and h_dia = aa.as_dia)) AND (aa.as_fecha between %s and %s)', (id,id,'2022-04-01','2022-06-30'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#llegada tarde tercer trimestre
@app.get('/api/asistencia/llegadaTardeTercerTrimestre/<id>')
def get_asistencia_llegadaTardeTercerTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) FROM asistencia aa, empleado e WHERE  ((aa.fk_e_clave = %s) and (e.e_clave = %s)) AND  (aa.as_hora_entrada > any (select h_hora_inicio FROM horario where e.e_clave = fk_e_clave and h_dia = aa.as_dia)) AND (aa.as_fecha between %s and %s)', (id,id,'2022-07-01','2022-09-30'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#llegada tarde cuarto trimestre
@app.get('/api/asistencia/llegadaTardeCuartoTrimestre/<id>')
def get_asistencia_llegadaTardeCuartoTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) FROM asistencia aa, empleado e WHERE  ((aa.fk_e_clave = %s) and (e.e_clave = %s)) AND  (aa.as_hora_entrada > any (select h_hora_inicio FROM horario where e.e_clave = fk_e_clave and h_dia = aa.as_dia)) AND (aa.as_fecha between %s and %s)', (id,id,'2022-10-01','2022-12-31'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)


#Cumplimiento de Horario primer trimestre
@app.get('/api/asistencia/cumplimientoHorarioPrimerTrimestre/<id>')
def get_asistencia_cumplimientoHorarioPrimerTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) FROM asistencia aa,empleado e where ((aa.fk_e_clave = %s) and (e.e_clave = %s)) AND  (aa.as_hora_entrada <= (select h_hora_inicio FROM horario where e.e_clave = fk_e_clave and h_dia = aa.as_dia)) AND  (aa.as_hora_salida >= (select h_hora_fin FROM horario where e.e_clave = fk_e_clave and h_dia = aa.as_dia)) AND (aa.as_fecha between %s and %s)', (id,id,'2022-01-01','2022-03-31'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#Cumplimiento de Horario segundo trimestre
@app.get('/api/asistencia/cumplimientoHorarioSegundoTrimestre/<id>')
def get_asistencia_cumplimientoHorarioSegundoTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) FROM asistencia aa,empleado e where ((aa.fk_e_clave = %s) and (e.e_clave = %s)) AND  (aa.as_hora_entrada <= (select h_hora_inicio FROM horario where e.e_clave = fk_e_clave and h_dia = aa.as_dia)) AND  (aa.as_hora_salida >= (select h_hora_fin FROM horario where e.e_clave = fk_e_clave and h_dia = aa.as_dia)) AND (aa.as_fecha between %s and %s)', (id,id,'2022-04-01','2022-06-30'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#Cumplimiento de Horario tercer trimestre
@app.get('/api/asistencia/cumplimientoHorarioTercerTrimestre/<id>')
def get_asistencia_cumplimientoHorarioTercerTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) FROM asistencia aa,empleado e where ((aa.fk_e_clave = %s) and (e.e_clave = %s)) AND  (aa.as_hora_entrada <= (select h_hora_inicio FROM horario where e.e_clave = fk_e_clave and h_dia = aa.as_dia)) AND  (aa.as_hora_salida >= (select h_hora_fin FROM horario where e.e_clave = fk_e_clave and h_dia = aa.as_dia)) AND (aa.as_fecha between %s and %s)', (id,id,'2022-07-01','2022-09-30'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#Cumplimiento de Horario cuarto trimestre
@app.get('/api/asistencia/cumplimientoHorarioCuartoTrimestre/<id>')
def get_asistencia_cumplimientoHorarioCuartoTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) FROM asistencia aa,empleado e where ((aa.fk_e_clave = %s) and (e.e_clave = %s)) AND  (aa.as_hora_entrada <= (select h_hora_inicio FROM horario where e.e_clave = fk_e_clave and h_dia = aa.as_dia)) AND  (aa.as_hora_salida >= (select h_hora_fin FROM horario where e.e_clave = fk_e_clave and h_dia = aa.as_dia)) AND (aa.as_fecha between %s and %s)', (id,id,'2022-10-01','2022-12-31'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#Hora entrada promedio
@app.get('/api/asistencia/horaEntradaPROM/<id>')
def get_asistencia_horaEntradaPROM(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select AVG(as_hora_entrada) from asistencia where fk_e_clave = %s', (id,))
    user = cur.fetchall()

    json_str = json.dumps(user, default=str)
    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return json_str

#Hora salida promedio
@app.get('/api/asistencia/horaSalidaPROM/<id>')
def get_asistencia_horaSalidaPROM(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select AVG(as_hora_salida) from asistencia where fk_e_clave = %s', (id,))
    user = cur.fetchall()

    json_str = json.dumps(user, default=str)
    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return json_str

#Hora entrada asignada
@app.get('/api/asistencia/horaEntradaAsignada/<id>')
def get_asistencia_horaEntradaAsignada(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select h_hora_inicio, h_dia from horario where fk_e_clave = %s', (id,))
    user = cur.fetchall()

    json_str = json.dumps(user, default=str)
    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return json_str

#Hora salida asignada
@app.get('/api/asistencia/horaSalidaAsignada/<id>')
def get_asistencia_horaSalidaAsignada(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select h_hora_fin, h_dia from horario where fk_e_clave = %s', (id,))
    user = cur.fetchall()

    json_str = json.dumps(user, default=str)
    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return json_str



#-------------------------------------DESCUENTOS--------------------------------------------

@app.get('/api/descuento') #devuelve todos los productos
def get_descuentos():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM producto_revista')
    descuentos = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(descuentos)  

@app.put('/api/descuentoP/<id>')
def update_descuento(id):

    new_desc = request.get_json()
    p_r_precio_oferta = new_desc['p_r_precio_oferta']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('UPDATE producto_revista SET P_r_precio_oferta = %s WHERE fk_p_id = %s RETURNING *',
    (p_r_precio_oferta,id))

    conn.commit()

    new_desc = cur.fetchone()
    cur.close()
    conn.close()

    return jsonify(new_desc)


@app.get('/api/descuento/<id>')
def get_descuento_id(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM producto_revista WHERE fk_p_id = %s',(id,))
    desc = cur.fetchone()

    cur.close()
    conn.close()

    if desc is None:
         return jsonify({'message':'Descuento not found'}), 404


    return jsonify(desc)

@app.post('/api/descuento')
def create_descuento():
    new_descuento = request.get_json()

    idP = new_descuento['fk_p_id']
    idSf = new_descuento['fk_sf_id']
    precioF = new_descuento['p_r_precio_oferta']
    
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('INSERT INTO producto_revista (fk_p_id, fk_sf_id, p_r_precio_oferta) VALUES (%s, %s, %s) RETURNING *',
    (idP, idSf, precioF))

    new_descuento = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return jsonify(new_descuento)

@app.delete('/api/descuentoD/<id>')
def delete_descuento(id):
    
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('DELETE FROM producto_revista WHERE fk_p_id = %s',(id,))
    conn.commit()
    cur.close()
    conn.close()


#-------------------------------------CONSULTAS DASHBOARD--------------------------------------------

@app.get('/api/ventasPorMes')
def get_ventasPorMes():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('''select foo.date_part, sum(count) from (
                select date_part('month',po.pe_fecha), count(po.pe_id)
                from pedido_online po
                group by 1
                union all
                select date_part('month',pf.pe_fecha), count(pf.pe_id)
                from pedido_fisico pf
                group by 1
                ) as foo
                group by 1''')
    ventas = cur.fetchall()
    
    cur.close()
    conn.close()

    if ventas is None:
        return jsonify({'message':'Ventas not found'}), 404

    return jsonify(ventas)

@app.get('/api/ventasEnLinea')
def get_ventasEnLinea():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('''select count(po.pe_id)
                    from pedido_online po
                    ''')
    ventas = cur.fetchone()
    
    cur.close()
    conn.close()

    if ventas is None:
        return jsonify({'message':'Ventas not found'}), 404

    return jsonify(ventas)

@app.get('/api/ventasFisico')
def get_ventasFisico():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('''select t.ti_nombre, count(pf.pe_id) 
                    from pedido_fisico pf, tienda t
                    where t.ti_id = pf.fk_ti_id 
                    group by t.ti_nombre
                    order by count desc
                    ''')
    ventas = cur.fetchall()
    
    cur.close()
    conn.close()

    if ventas is None:
        return jsonify({'message':'Ventas not found'}), 404

    return jsonify(ventas)

@app.get('/api/topMetodoPago')
def get_topMetodoPago():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('''select mp.mp_tipo, sum(foo.count)
                    from metodo_pago mp, (select mo.fk_mp_id, count(mo.fk_mp_id)
                            from metodopago_online mo
                            group by 1
                            union all
                            select mf.fk_mp_id, count(mf.fk_mp_id)
                            from metodopago_fisico mf 
                            group by 1) foo
                    where mp.mp_id = foo.fk_mp_id
                    group by 1
                    order by mp.mp_tipo''')
    topMetodoPago = cur.fetchall()
    
    cur.close()
    conn.close()

    if topMetodoPago is None:
        return jsonify({'message':'error'}), 404

    return jsonify(topMetodoPago)    

@app.get('/api/topProducto')
def get_topProducto():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('''select p.p_nombre , count(dp.fk_p_id), sum(dp.dp_cantidad)
                    from detalle_pedido dp, producto p
                    where p.p_id = dp.fk_p_id AND dp.fk_pf_id is null
                    group by p.p_nombre 
                    order by sum(dp_cantidad) desc
                    limit 1 ''')
    topProducto = cur.fetchone()
    
    cur.close()
    conn.close()

    if topProducto is None:
        return jsonify({'message':'No hay productos'}), 404

    return jsonify(topProducto)

@app.get('/api/worseProducto')
def get_worseProducto():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('''select p.p_nombre , count(dp.fk_p_id), sum(dp.dp_cantidad)
                    from detalle_pedido dp, producto p
                    where p.p_id = dp.fk_p_id AND dp.fk_pf_id is null
                    group by p.p_nombre 
                    order by sum(dp_cantidad) asc
                    limit 1 ''')
    worseProducto = cur.fetchone()
    
    cur.close()
    conn.close()

    if worseProducto is None:
        return jsonify({'message':'No hay productos'}), 404

    return jsonify(worseProducto)

@app.get('/api/statsPuntos')
def get_statsPuntos():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('''select sum(gastados) as gastados, otorgados from (
					select sum(mf.mp_monto_cancelado) as gastados
					from metodopago_fisico mf, metodo_pago mp 
					where mf.fk_mp_id = mp.mp_id and mp.mp_tipo = 'Puntos'
					union all
					select sum(mo.mp_monto_cancelado) as gastados
					from metodopago_online mo, metodo_pago mp 
					where mo.fk_mp_id = mp.mp_id and mp.mp_tipo = 'Puntos'
                    ) as foo, (select count(distinct mf.fk_pe_id) as Otorgados
                                    from metodopago_fisico mf 

                    ) as foo2
                    group by otorgados''')
    statsPuntos = cur.fetchone()
    
    cur.close()
    conn.close()

    if statsPuntos is None:
        return jsonify({'message':'No hay productos'}), 404

    return jsonify(statsPuntos)    





#----------------------------------------------------------
#----------------CONTROL DE DIRECCIONES--------------------
#----------------------------------------------------------

@app.get('/')
def home():
    return send_file('static/index.html')

@app.get('/crearUsuarios')
def register():
    return send_file('static/crearUsuarios.html')

@app.get('/login')
def login():
    return send_file('static/iniciarSesion.html')    

@app.get('/hub')
def hub():
    return send_file('static/hub.html')

@app.get('/carrito')
def carrito():
    return send_file('static/carrito.html')

@app.get('/registroClientes')
def crearClientes():
    return send_file('static/registroClientes.html')

@app.get('/crearRol')
def crearRol():
    return send_file('static/crearRoles.html')    

@app.get('/usuariosCreados')
def usCred():
    return send_file('static/usuariosCreados.html')                                                                     

@app.get('/asignRol')
def clntRl():
    return send_file('static/clienteRol.html')

@app.get('/credit')
def credT():
    return send_file('static/agregarCredito.html')

@app.get('/debito')
def debtT():
    return send_file('static/agregarDebito.html')

@app.get('/PgMvl')
def pgMvl():
    return send_file('static/agregarPagomovil.html')

@app.get('/Paypal')
def paypal():
    return send_file('static/agregarPaypal.html')

@app.get('/Zelle')
def zelle():
    return send_file('static/agregarZelle.html') 

@app.get('/mtdPago')
def mtdPG():
    return send_file('static/metodoPago.html')

@app.get('/crearProducto')          
def crearProducto():
    return send_file('static/agregarProducto.html')  

@app.get('/registroClnN')
def regclnN():
    return send_file('static/registroTipoClienteNatural.html')
                
@app.get('/registroClnJ')
def regclnJ():
    return send_file('static/registroTipoClienteJuridico.html')

@app.get('/rolesCreados')
def rolsCrds():
    return send_file('static/displayRoles.html')

@app.get('/agregarContacto')
def contacto():
    return send_file('static/agregarPersonaContacto.html')        

@app.get('/productosCreados')
def prdCrd():
    return send_file('static/productosCreados.html')                                             

@app.get('/pagar')
def pgr():
    return send_file('static/pagar.html')

@app.get('/pagarFisico')
def pgrF():
    return send_file('static/pagarFisico.html')

@app.get('/pedidosCreados')
def pedCrd():
    return send_file('static/pedidosCreados.html')

@app.get('/cambiarEstatus')
def cambiarEstatus():
    return send_file('static/cambiarEstatus.html')

@app.get('/mostrarClientes')
def mostrarClientes():
    return send_file('static/mostrarClientes.html')    

@app.get('/pdf')
def pdf():
    return send_file('static/pdf.html')    

@app.get('/presupuesto')
def presupuesto():
    return send_file('static/presupuesto.html')    

@app.get('/registroEmpleado')
def registroEmpleado():
    return send_file('static/registroEmpleado.html')

@app.get('/cajero')
def cajero():
    return send_file('static/cajero.html')

@app.get('/pdfPedido')
def pdfPed():
    return send_file('static/pdf.html')

@app.get('/pdfFisico')
def pdfFis():
    return send_file('static/pdfFisico.html')

@app.get('/seleccionarTipoFisico')
def seleccionarTipoFisico():
    return send_file('static/seleccionarTipoFisico.html')

@app.get('/datosClienteNatural')
def datosClienteNatural():
    return send_file('static/datosClienteNatural.html')

@app.get('/datosClienteJuridico')
def datosClienteJuridico():
    return send_file('static/datosClienteJuridico.html')

@app.get('/agregarPagoFisico')
def agregarPagoFisico():
    return send_file('static/agregarPagoFisico.html')

@app.get('/pedidosFisicosCreados')
def pedidosFisicosCreados():
    return send_file('static/pedidosFisicosCreados.html')

@app.get('/cambiarEstatusFisico')
def cambiarEstatusFisico():
    return send_file('static/cambiarEstatusFisico.html')

@app.get('/asistencia')
def asistencia():
    return send_file('static/asistencia.html')

@app.get('/pedidosFabricaCreados')
def pedidosFabricaCreados():
    return send_file('static/pedidosFabricaCreados.html')

@app.get('/cambiarEstatusFabrica')
def cambiarEstatusFabrica():
    return send_file('static/cambiarEstatusFabrica.html')

@app.get('/verDescuentos')
def verDescuentos():
    return send_file('static/pdfDescuento.html')

@app.get('/verReportes')
def verReportes():
    return send_file('static/talentoHumano.html')

@app.get('/dashboard')
def dashboard():
    return send_file('static/dashboard.html')

@app.get('/pdfFabrica')
def pdfFabrica():
    return send_file('static/pdfFabrica.html')

@app.get('/pedidosPasillo')
def pedidosPasillo():
    return send_file('static/pedidosPasillo.html')

if __name__ == '__main__':
    app.run(debug=True)