const teacherService = require('../services/teacherService');
const teacherRepository = require('../repositories/teacherRepository');
const AppError = require('../utils/AppError');

// Mock the repository
jest.mock('../repositories/teacherRepository');

describe('Teacher Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('registerStudents', () => {
    describe('registerStudents', () => {
      it('should register students with a teacher', async () => {
        // Setup
        const teacherEmail = 'teacher@example.com';
        const studentEmails = ['student1@example.com', 'student2@example.com'];
        const mockTeacher = { id: 1, email: teacherEmail };
        const mockStudents = [
          [{ id: 1, email: studentEmails[0] }, true],
          [{ id: 2, email: studentEmails[1] }, true]
        ];
  
        teacherRepository.findOrCreateTeacher.mockResolvedValue([mockTeacher, true]);
        teacherRepository.findOrCreateStudents.mockResolvedValue(mockStudents);
        teacherRepository.associateStudentsWithTeacher.mockResolvedValue(true);
  
        // Execute
        await teacherService.registerStudents(teacherEmail, studentEmails);
  
        // Verify
        expect(teacherRepository.findOrCreateTeacher).toHaveBeenCalledWith(teacherEmail);
        expect(teacherRepository.findOrCreateStudents).toHaveBeenCalledWith(studentEmails);
        expect(teacherRepository.associateStudentsWithTeacher).toHaveBeenCalledWith(mockTeacher, mockStudents);
      });
    });
  });

  describe('getCommonStudents', () => {
    it('should return common students between multiple teachers', async () => {
      // Setup
      const teacherEmails = ['teacher1@example.com', 'teacher2@example.com'];
      const mockTeachers = [
        {
          email: teacherEmails[0],
          Students: [
            { email: 'student1@example.com' },
            { email: 'student2@example.com' },
            { email: 'student3@example.com' }
          ]
        },
        {
          email: teacherEmails[1],
          Students: [
            { email: 'student2@example.com' },
            { email: 'student3@example.com' },
            { email: 'student4@example.com' }
          ]
        }
      ];

      teacherRepository.findTeachersByEmails.mockResolvedValue(mockTeachers);

      // Execute
      const result = await teacherService.getCommonStudents(teacherEmails);

      // Verify
      expect(teacherRepository.findTeachersByEmails).toHaveBeenCalledWith(teacherEmails);
      expect(result).toEqual(['student2@example.com', 'student3@example.com']);
    });

    it('should return empty array if no teachers found', async () => {
      teacherRepository.findTeachersByEmails.mockResolvedValue([]);
      
      const result = await teacherService.getCommonStudents(['nonexistent@example.com']);
      
      expect(result).toEqual([]);
    });
  });

  describe('suspendStudent', () => {
    it('should suspend a student', async () => {
      // Setup
      const studentEmail = 'student@example.com';
      const mockStudent = { id: 1, email: studentEmail };

      teacherRepository.findStudentByEmail.mockResolvedValue(mockStudent);
      teacherRepository.createSuspension.mockResolvedValue([{}, true]);

      // Execute
      await teacherService.suspendStudent(studentEmail);

      // Verify
      expect(teacherRepository.findStudentByEmail).toHaveBeenCalledWith(studentEmail);
      expect(teacherRepository.createSuspension).toHaveBeenCalledWith(mockStudent.id);
    });

    it('should throw an error if student is not found', async () => {
      teacherRepository.findStudentByEmail.mockResolvedValue(null);

      await expect(teacherService.suspendStudent('nonexistent@example.com'))
        .rejects
        .toThrow(new AppError('Student not found', 404));
    });
  });

  describe('getNotificationRecipients', () => {
    it('should return active registered students and mentioned students', async () => {
      // Setup
      const teacherEmail = 'teacher@example.com';
      const notification = 'Hello students! @student3@example.com @student4@example.com';
      
      const mockTeacher = {
        email: teacherEmail,
        Students: [
          { email: 'student1@example.com' },
          { email: 'student2@example.com' }
        ]
      };

      const allEmails = ['student1@example.com', 'student2@example.com', 'student3@example.com', 'student4@example.com'];
      
      const mockActiveStudents = [
        { email: 'student1@example.com', Suspension: null },
        { email: 'student2@example.com', Suspension: { id: 1 } }, // Suspended
        { email: 'student3@example.com', Suspension: null },
        { email: 'student4@example.com', Suspension: null }
      ];

      teacherRepository.findTeacherWithStudents.mockResolvedValue(mockTeacher);
      teacherRepository.findActiveStudents.mockResolvedValue(mockActiveStudents);

      // Execute
      const result = await teacherService.getNotificationRecipients(teacherEmail, notification);

      // Verify
      expect(teacherRepository.findTeacherWithStudents).toHaveBeenCalledWith(teacherEmail);
      expect(teacherRepository.findActiveStudents).toHaveBeenCalledWith(allEmails);
      expect(result).toEqual(['student1@example.com', 'student3@example.com', 'student4@example.com']);
    });

    it('should handle case when teacher is not found', async () => {
      const notification = 'Hello students! @student1@example.com';
      
      teacherRepository.findTeacherWithStudents.mockResolvedValue(null);
      teacherRepository.findActiveStudents.mockResolvedValue([
        { email: 'student1@example.com', Suspension: null }
      ]);
      
      await expect(teacherService.getNotificationRecipients('nonexistent@example.com', notification))
      .rejects
      .toThrow(new AppError('Teacher not found', 404));
    });

    it('should handle case with no mentioned students', async () => {
      const teacherEmail = 'teacher@example.com';
      const notification = 'Hello students! No mentions here.';
      
      const mockTeacher = {
        email: teacherEmail,
        Students: [
          { email: 'student1@example.com' },
          { email: 'student2@example.com' }
        ]
      };

      teacherRepository.findTeacherWithStudents.mockResolvedValue(mockTeacher);
      teacherRepository.findActiveStudents.mockResolvedValue([
        { email: 'student1@example.com', Suspension: null },
        { email: 'student2@example.com', Suspension: null }
      ]);

      const result = await teacherService.getNotificationRecipients(teacherEmail, notification);
      
      expect(result).toEqual(['student1@example.com', 'student2@example.com']);
    });
  });
});