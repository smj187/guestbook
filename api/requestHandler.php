<?php

require_once 'database.php';
require_once 'entry.php'; 

class RequestHandler {
    
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        header('Content-Type: application/json');
        
        switch ($method) {
            case 'GET':
                echo json_encode($this->getAllEntries());
                break;
            case 'POST':
                echo json_encode($this->createEntry());
                break;
            case 'DELETE':
                echo json_encode($this->deleteEntry());
                break;
            default:
                echo json_encode(['error' => 'Method not supported']);
                break;
        }
    }

    private function getAllEntries() {
        return Entry::all()->toArray();
    }

    private function createEntry() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['name']) && isset($data['message'])) {
            Entry::create(['name' => $data['name'], 'message' => $data['message']]);
            return ['message' => 'Entry added successfully'];
        } else {
            return ['error' => 'Name and message fields are required'];
        }
    }

    private function deleteEntry() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['id'])) {
            $entry = Entry::find($data['id']);
            if ($entry) {
                $entry->delete();
                return ['message' => 'Entry deleted successfully'];
            } else {
                return ['error' => 'Entry not found'];
            }
        } else {
            return ['error' => 'ID field is required'];
        }
    }
}