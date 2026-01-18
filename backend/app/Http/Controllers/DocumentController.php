<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class DocumentController extends Controller
{
    /**
     * Display a listing of documents
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Document::with(['user', 'mission', 'reviewer']);

        // Admins can see all documents, users only see their own
        if (!$user->isAdmin()) {
            $query->forUser($user->id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->status($request->status);
        }

        // Filter by document type
        if ($request->has('document_type')) {
            $query->documentType($request->document_type);
        }

        // Search by title
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Sort by created_at descending by default
        $documents = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($documents);
    }

    /**
     * Store a newly uploaded document
     */
    public function store(Request $request)
    {
        // Check authorization
        if (!$request->user()->hasRole('user')) {
            return response()->json([
                'message' => 'Only users with user role can upload documents.'
            ], 403);
        }

        // Validate request
        $validator = Validator::make($request->all(), [
            'document_type' => 'required|in:passport,visa,other',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'mission_id' => 'nullable|exists:missions,id',
            'file' => 'required|file|mimes:pdf|max:5120', // 5MB = 5120KB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $file = $request->file('file');
            
            // Generate unique filename
            $fileName = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.pdf';
            
            // Store file in documents disk
            $filePath = $file->storeAs('documents', $fileName, 'documents');

            // Create document record
            $document = Document::create([
                'user_id' => $request->user()->id,
                'mission_id' => $request->mission_id,
                'document_type' => $request->document_type,
                'title' => $request->title,
                'description' => $request->description,
                'file_path' => $filePath,
                'file_name' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'status' => 'pending',
            ]);

            return response()->json([
                'message' => 'Document uploaded successfully',
                'document' => $document->load(['user', 'mission'])
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to upload document',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified document
     */
    public function show(Request $request, Document $document)
    {
        // Check authorization
        if (!$request->user()->isAdmin() && $document->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized to view this document'
            ], 403);
        }

        return response()->json([
            'document' => $document->load(['user', 'mission', 'reviewer'])
        ]);
    }

    /**
     * Download the document file
     */
    public function download(Request $request, Document $document)
    {
        // Check authorization
        if (!$request->user()->isAdmin() && $document->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized to download this document'
            ], 403);
        }

        $filePath = storage_path('app/documents/' . $document->file_path);

        if (!file_exists($filePath)) {
            return response()->json([
                'message' => 'File not found'
            ], 404);
        }

        return response()->download($filePath, $document->file_name);
    }

    /**
     * Approve a document
     */
    public function approve(Request $request, Document $document)
    {
        // Check authorization
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Only admins can approve documents'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'comments' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $document->update([
            'status' => 'approved',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'review_comments' => $request->comments,
        ]);

        return response()->json([
            'message' => 'Document approved successfully',
            'document' => $document->load(['user', 'mission', 'reviewer'])
        ]);
    }

    /**
     * Reject a document
     */
    public function reject(Request $request, Document $document)
    {
        // Check authorization
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Only admins can reject documents'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'comments' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $document->update([
            'status' => 'rejected',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'review_comments' => $request->comments,
        ]);

        return response()->json([
            'message' => 'Document rejected',
            'document' => $document->load(['user', 'mission', 'reviewer'])
        ]);
    }

    /**
     * Remove the specified document
     */
    public function destroy(Request $request, Document $document)
    {
        // Check authorization
        if (!$request->user()->isAdmin() && $document->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized to delete this document'
            ], 403);
        }

        // Users can only delete pending documents
        if (!$request->user()->isAdmin() && !$document->isPending()) {
            return response()->json([
                'message' => 'You can only delete pending documents'
            ], 403);
        }

        try {
            // Delete file from storage
            Storage::disk('documents')->delete($document->file_path);

            // Soft delete document record
            $document->delete();

            return response()->json([
                'message' => 'Document deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete document',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get document statistics (for admins)
     */
    public function statistics(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $stats = [
            'total' => Document::count(),
            'pending' => Document::status('pending')->count(),
            'approved' => Document::status('approved')->count(),
            'rejected' => Document::status('rejected')->count(),
            'by_type' => [
                'passport' => Document::documentType('passport')->count(),
                'visa' => Document::documentType('visa')->count(),
                'other' => Document::documentType('other')->count(),
            ],
        ];

        return response()->json($stats);
    }
}
