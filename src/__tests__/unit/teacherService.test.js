const teacherService = require('../../services/teacherService');
const teacherRepository = require('../../repositories/teacherRepository');

// Mock the teacherRepository
jest.mock('../../repositories/teacherRepository.js', () => require('../__mocks__/teacherRepository'));

describe('Teacher Service Tests', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('registerStudents', () => {
    it('should call repository to register students', async () => {
      // Arrange
      const teacherEmail = 'teacherken@gmail.com';
      const studentEmails = ['student1@gmail.com', 'student2@gmail.com'];
      teacherRepository.registerStudents.mockResolvedValue(undefined);
      
      // Act
      await teacherService.registerStudents(teacherEmail, studentEmails);
      
      // Assert
      expect(teacherRepository.registerStudents).toHaveBeenCalledWith(teacherEmail, studentEmails);
      expect(teacherRepository.registerStudents).toHaveBeenCalledTimes(1);
    });
    
    it('should propagate errors from repository', async () => {
      // Arrange
      const teacherEmail = 'teacherken@gmail.com';
      const studentEmails = ['student1@gmail.com'];
      const errorMessage = 'Registration failed';
      teacherRepository.registerStudents.mockRejectedValue(new Error(errorMessage));
      
      // Act & Assert
      await expect(teacherService.registerStudents(teacherEmail, studentEmails))
        .rejects.toThrow(errorMessage);
    });
  });
  
  describe('getCommonStudents', () => {
    it('should call repository to get common students with a single teacher', async () => {
      // Arrange
      const teacher = 'teacherken@gmail.com';
      const mockStudents = ['student1@gmail.com', 'student2@gmail.com'];
      teacherRepository.getCommonStudents.mockResolvedValue(mockStudents);
      
      // Act
      const result = await teacherService.getCommonStudents(teacher);
      
      // Assert
      expect(teacherRepository.getCommonStudents).toHaveBeenCalledWith(teacher);
      expect(result).toEqual(mockStudents);
    });
    
    it('should call repository to get common students with multiple teachers', async () => {
      // Arrange
      const teachers = ['teacherken@gmail.com', 'teacherjoe@gmail.com'];
      const mockStudents = ['commonstudent@gmail.com'];
      teacherRepository.getCommonStudents.mockResolvedValue(mockStudents);
      
      // Act
      const result = await teacherService.getCommonStudents(teachers);
      
      // Assert
      expect(teacherRepository.getCommonStudents).toHaveBeenCalledWith(teachers);
      expect(result).toEqual(mockStudents);
    });
    
    it('should propagate errors from repository', async () => {
      // Arrange
      const teachers = ['invalid@gmail.com'];
      const errorMessage = 'Teacher not found';
      teacherRepository.getCommonStudents.mockRejectedValue(new Error(errorMessage));
      
      // Act & Assert
      await expect(teacherService.getCommonStudents(teachers))
        .rejects.toThrow(errorMessage);
    });
  });
  
  describe('suspendStudent', () => {
    it('should call repository to suspend a student', async () => {
      // Arrange
      const studentEmail = 'student1@gmail.com';
      teacherRepository.suspendStudent.mockResolvedValue(undefined);
      
      // Act
      await teacherService.suspendStudent(studentEmail);
      
      // Assert
      expect(teacherRepository.suspendStudent).toHaveBeenCalledWith(studentEmail);
      expect(teacherRepository.suspendStudent).toHaveBeenCalledTimes(1);
    });
    
    it('should propagate errors from repository', async () => {
      // Arrange
      const studentEmail = 'nonexistent@gmail.com';
      const errorMessage = 'Student not found';
      teacherRepository.suspendStudent.mockRejectedValue(new Error(errorMessage));
      
      // Act & Assert
      await expect(teacherService.suspendStudent(studentEmail))
        .rejects.toThrow(errorMessage);
    });
  });
  
  describe('getNotificationRecipients', () => {
    it('should call repository to get notification recipients', async () => {
      // Arrange
      const teacherEmail = 'teacherken@gmail.com';
      const notification = 'Hello @student1@gmail.com';
      const mockRecipients = ['student1@gmail.com', 'student2@gmail.com'];
      teacherRepository.getNotificationRecipients.mockResolvedValue(mockRecipients);
      
      // Act
      const result = await teacherService.getNotificationRecipients(teacherEmail, notification);
      
      // Assert
      expect(teacherRepository.getNotificationRecipients).toHaveBeenCalledWith(
        teacherEmail,
        notification
      );
      expect(result).toEqual(mockRecipients);
    });
    
    it('should propagate errors from repository', async () => {
      // Arrange
      const teacherEmail = 'invalid@gmail.com';
      const notification = 'Hello';
      const errorMessage = 'Teacher not found';
      teacherRepository.getNotificationRecipients.mockRejectedValue(new Error(errorMessage));
      
      // Act & Assert
      await expect(teacherService.getNotificationRecipients(teacherEmail, notification))
        .rejects.toThrow(errorMessage);
    });
  });
});