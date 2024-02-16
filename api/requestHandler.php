<?php

require_once 'database.php';
require_once 'entry.php';

class RequestHandler
{

    public function handleRequest()
    {
        header('Access-Control-Allow-Origin: http://127.0.0.1:5173');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

        header('Content-Type: application/json');

        // Handling OPTIONS method for preflight requests
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }

        $method = $_SERVER['REQUEST_METHOD'];
        $uri = $_SERVER['REQUEST_URI'];

        header('Content-Type: application/json');

        switch ($method) {
            case 'GET':
                echo json_encode($this->getAllEntries());
                break;
            case 'POST':
                echo json_encode($this->createEntry());
                break;
            case 'DELETE':
                $this->handleDelete($uri);
                break;
            default:
                echo json_encode(['error' => 'Method not supported']);
                break;
        }
    }

    private function getAllEntries()
    {
        $pageSize = $_GET['pageSize'] ?? 10;
        $page = $_GET['page'] ?? 1;

        $pageSize = max(1, (int) $pageSize);
        $page = max(1, (int) $page);

        // calculate the pagination
        $total = Entry::count();
        $lastPage = ceil($total / $pageSize);
        $offset = ($page - 1) * $pageSize;
        $entries = Entry::orderBy('created_at', 'desc')->skip($offset)->take($pageSize)->get();

        return [
            'data' => $entries,
            'pagination' => [
                'current_page' => $page,
                'last_page' => $lastPage,
                'per_page' => $pageSize,
                'total' => $total,
            ]
        ];
    }


    private function createEntry()
{
    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['name']) && isset($data['message'])) {
        $entry = Entry::create(['name' => $data['name'], 'message' => $data['message']]);
        return $entry; 
    } else {
        return ['error' => 'Name and message fields are required'];
    }
}



    private function handleDelete($uri)
    {
        $parts = explode('/', $uri);
        $id = $parts[count($parts) - 1];

        if (is_numeric($id)) {
            echo json_encode($this->deleteEntry($id));
        } else {
            echo json_encode(['error' => 'Invalid ID']);
        }
    }

    private function deleteEntry($id)
    {
        $entry = Entry::find($id);
        if ($entry) {
            $entry->delete();
            return ['message' => 'Entry deleted successfully'];
        } else {
            return ['error' => 'Entry not found'];
        }
    }
}