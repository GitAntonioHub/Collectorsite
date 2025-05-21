# Changelog

## [1.0.0] - 2023-11-30

### Fixed
- Fixed notification.payload_json column type in Flyway V5 migration
- Added proper @Service annotations to service implementations
- Fixed StorageClient bean resolution by configuring proper profile settings
- Fixed showHolo binding issue by adding HoloBackgroundComponent
- Fixed upload service integration with progress tracking
- Fixed CommonModule import in Angular standalone components
- Fixed type mismatches in item ID handling

### Added
- Created deploy/docker-compose.yml for production deployment
- Added nginx configuration for the frontend with API proxying
- Added demo data seed with users, items, listings, and offers (V6 migration)
- Created UploadProgress interface for better upload handling
- Added proper WebSocket proxy configuration for real-time updates
- Added environment configuration handling for dev/prod setups

### Changed
- Updated upload service to properly handle upload progress tracking
- Improved Angular component structure for better modularity
- Enhanced Docker configuration for scalable deployment 