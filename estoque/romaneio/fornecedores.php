<?php

// DB table to use
$table = 'fornecedor';
// Table's primary key
$primaryKey = 'id_fornecedor';

$columns = array(

    array('db' => 'codigo', 'dt' => 0, 'formatter' => function ($d, $row) {

        return $d;
    }),
    array('db' => 'nome', 'dt' => 1, 'formatter' => function ($d, $row) {
        if ($d != '') {

            return  mb_strtoupper($d);
        } else {
            return '';
        }
    }),

    array('db' => 'id_fornecedor', 'dt' => 2, 'formatter' => function ($d, $row) {
        return $d;
    }),

);

require __DIR__ . '/../../ssp.class.php';
include __DIR__ . '/../../inc/company.php';

$where = 'id_empresa = ' . $company;

echo json_encode(
    SSP::complex($_GET, $sql_details, $table, $primaryKey, $columns, $where, $where)
);
